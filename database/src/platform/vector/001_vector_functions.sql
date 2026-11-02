-- ============================================================================
-- Platform Vector Functions
-- Reusable Embedding storage helpers, similarity search functions, pgvector utilities.
-- ============================================================================

-- ============================================================================
-- Vector Index Management
-- ============================================================================

-- Function to create HNSW index for vector similarity search
CREATE OR REPLACE FUNCTION platform.create_hnsw_index(
    p_table_name TEXT,
    p_column_name TEXT,
    p_dimensions INT DEFAULT 1536,
    p_m INT DEFAULT 16,
    p_ef_construction INT DEFAULT 64
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_index_name TEXT;
BEGIN
    v_index_name := 'idx_' || p_table_name || '_' || p_column_name || '_hnsw';
    
    EXECUTE format(
        'CREATE INDEX %I ON %I USING hnsw (%I vector_cosine_ops) WITH (m = %s, ef_construction = %s)',
        v_index_name, p_table_name, p_column_name, p_m, p_ef_construction
    );
    
    RAISE NOTICE 'Created HNSW index % on %.%', v_index_name, p_table_name, p_column_name;
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Index % already exists', v_index_name;
END;
$$;

-- Function to create IVFFlat index for vector similarity search
CREATE OR REPLACE FUNCTION platform.create_ivfflat_index(
    p_table_name TEXT,
    p_column_name TEXT,
    p_dimensions INT DEFAULT 1536,
    p_lists INT DEFAULT 100
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_index_name TEXT;
BEGIN
    v_index_name := 'idx_' || p_table_name || '_' || p_column_name || '_ivfflat';
    
    EXECUTE format(
        'CREATE INDEX %I ON %I USING ivfflat (%I vector_cosine_ops) WITH (lists = %s)',
        v_index_name, p_table_name, p_column_name, p_lists
    );
    
    RAISE NOTICE 'Created IVFFlat index % on %.%', v_index_name, p_table_name, p_column_name;
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Index % already exists', v_index_name;
END;
$$;

-- ============================================================================
-- Similarity Search Functions
-- ============================================================================

-- Function for cosine similarity search
CREATE OR REPLACE FUNCTION platform.cosine_similarity_search(
    p_table_name TEXT,
    p_column_name TEXT,
    p_query_vector VECTOR,
    p_limit INT DEFAULT 10,
    p_threshold REAL DEFAULT 0.7
)
RETURNS TABLE(
    id UUID,
    similarity REAL,
    record JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, 1 - (%I <=> $1) as similarity, to_jsonb(t) as record
         FROM %I t
         WHERE 1 - (%I <=> $1) >= $2
         ORDER BY %I <=> $1
         LIMIT $3',
        p_column_name, p_table_name, p_column_name, p_column_name, p_limit
    ) USING p_query_vector, p_threshold;
END;
$$;

-- Function for inner product similarity search
CREATE OR REPLACE FUNCTION platform.inner_product_search(
    p_table_name TEXT,
    p_column_name TEXT,
    p_query_vector VECTOR,
    p_limit INT DEFAULT 10,
    p_threshold REAL DEFAULT 0.7
)
RETURNS TABLE(
    id UUID,
    similarity REAL,
    record JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, (%I <#> $1) as similarity, to_jsonb(t) as record
         FROM %I t
         WHERE (%I <#> $1) >= $2
         ORDER BY %I <#> $1
         LIMIT $3',
        p_column_name, p_table_name, p_column_name, p_column_name, p_limit
    ) USING p_query_vector, p_threshold;
END;
$$;

-- Function for L2 distance similarity search
CREATE OR REPLACE FUNCTION platform.l2_distance_search(
    p_table_name TEXT,
    p_column_name TEXT,
    p_query_vector VECTOR,
    p_limit INT DEFAULT 10,
    p_threshold REAL DEFAULT 0.3
)
RETURNS TABLE(
    id UUID,
    distance REAL,
    record JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, (%I <-> $1) as distance, to_jsonb(t) as record
         FROM %I t
         WHERE (%I <-> $1) <= $2
         ORDER BY %I <-> $1
         LIMIT $3',
        p_column_name, p_table_name, p_column_name, p_column_name, p_limit
    ) USING p_query_vector, p_threshold;
END;
$$;

-- ============================================================================
-- Embedding Management Functions
-- ============================================================================

-- Function to generate embedding placeholder (replace with actual embedding service)
CREATE OR REPLACE FUNCTION platform.generate_embedding(p_text TEXT)
RETURNS VECTOR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- TODO: Integrate with embedding service (OpenAI, Cohere, etc.)
    -- For now, return a zero vector as placeholder
    RETURN '[0]'::VECTOR;
END;
$$;

-- Function to batch generate embeddings
CREATE OR REPLACE FUNCTION platform.generate_embeddings(p_texts TEXT[])
RETURNS VECTOR[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_embeddings VECTOR[];
    v_text TEXT;
BEGIN
    FOREACH v_text IN ARRAY p_texts
    LOOP
        v_embeddings := array_append(v_embeddings, platform.generate_embedding(v_text));
    END LOOP;
    
    RETURN v_embeddings;
END;
$$;

-- Function to update embedding for a record
CREATE OR REPLACE FUNCTION platform.update_embedding(
    p_table_name TEXT,
    p_id_column TEXT,
    p_id_value UUID,
    p_text_column TEXT,
    p_vector_column TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_text TEXT;
    v_embedding VECTOR;
BEGIN
    -- Get the text
    EXECUTE format('SELECT %I FROM %I WHERE %I = $1', p_text_column, p_table_name, p_id_column)
    INTO v_text
    USING p_id_value;
    
    -- Generate embedding
    v_embedding := platform.generate_embedding(v_text);
    
    -- Update the vector column
    EXECUTE format('UPDATE %I SET %I = $1 WHERE %I = $2', p_table_name, p_vector_column, p_id_column)
    USING v_embedding, p_id_value;
END;
$$;

-- ============================================================================
-- Vector Utility Functions
-- ============================================================================

-- Function to normalize a vector
CREATE OR REPLACE FUNCTION platform.normalize_vector(p_vector VECTOR)
RETURNS VECTOR
LANGUAGE sql
STRICT
AS $$
SELECT p_vector / sqrt(array_length(p_vector::real[], 1)::float8)::VECTOR;
$$;

-- Function to calculate vector dimensions
CREATE OR REPLACE FUNCTION platform.vector_dimensions(p_vector VECTOR)
RETURNS INT
LANGUAGE sql
STRICT
AS $$
SELECT array_length(p_vector::real[], 1);
$$;

-- Function to check if vectors are compatible
CREATE OR REPLACE FUNCTION platform.vectors_compatible(p_vector1 VECTOR, p_vector2 VECTOR)
RETURNS boolean
LANGUAGE sql
STRICT
AS $$
SELECT platform.vector_dimensions(p_vector1) = platform.vector_dimensions(p_vector2);
$$;

-- Function to average vectors
CREATE OR REPLACE FUNCTION platform.average_vectors(p_vectors VECTOR[])
RETURNS VECTOR
LANGUAGE plpgsql
STRICT
AS $$
DECLARE
    v_dimensions INT;
    v_result REAL[];
    v_i INT;
    v_vector VECTOR;
BEGIN
    IF array_length(p_vectors, 1) IS NULL OR array_length(p_vectors, 1) = 0 THEN
        RETURN NULL::VECTOR;
    END IF;
    
    v_dimensions := platform.vector_dimensions(p_vectors[1]);
    v_result := array_fill(0::real, ARRAY[v_dimensions]);
    
    FOREACH v_vector IN ARRAY p_vectors
    LOOP
        IF NOT platform.vectors_compatible(p_vectors[1], v_vector) THEN
            RAISE EXCEPTION 'Vector dimensions do not match';
        END IF;
        
        FOR v_i IN 1..v_dimensions LOOP
            v_result[v_i] := v_result[v_i] + (v_vector::real[])[v_i];
        END LOOP;
    END LOOP;
    
    -- Divide by number of vectors
    FOR v_i IN 1..v_dimensions LOOP
        v_result[v_i] := v_result[v_i] / array_length(p_vectors, 1);
    END LOOP;
    
    RETURN v_result::VECTOR;
END;
$$;

-- ============================================================================
-- Vector Analysis Functions
-- ============================================================================

-- Function to get vector statistics for a table
CREATE OR REPLACE FUNCTION platform.get_vector_stats(
    p_table_name TEXT,
    p_column_name TEXT
)
RETURNS TABLE(
    row_count BIGINT,
    avg_norm REAL,
    min_norm REAL,
    max_norm REAL,
    dimensions INT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    COUNT(*) as row_count,
    AVG(vector_length(p_column_name)) as avg_norm,
    MIN(vector_length(p_column_name)) as min_norm,
    MAX(vector_length(p_column_name)) as max_norm,
    platform.vector_dimensions(p_column_name) as dimensions
FROM (SELECT * FROM p_table_name LIMIT 1000) t; -- Sample for performance
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.create_hnsw_index(p_table_name TEXT, p_column_name TEXT, p_dimensions INT, p_m INT, p_ef_construction INT) IS 'Create HNSW index for vector similarity search';
COMMENT ON FUNCTION platform.create_ivfflat_index(p_table_name TEXT, p_column_name TEXT, p_dimensions INT, p_lists INT) IS 'Create IVFFlat index for vector similarity search';
COMMENT ON FUNCTION platform.cosine_similarity_search(p_table_name TEXT, p_column_name TEXT, p_query_vector VECTOR, p_limit INT, p_threshold REAL) IS 'Cosine similarity search';
COMMENT ON FUNCTION platform.inner_product_search(p_table_name TEXT, p_column_name TEXT, p_query_vector VECTOR, p_limit INT, p_threshold REAL) IS 'Inner product similarity search';
COMMENT ON FUNCTION platform.l2_distance_search(p_table_name TEXT, p_column_name TEXT, p_query_vector VECTOR, p_limit INT, p_threshold REAL) IS 'L2 distance similarity search';
COMMENT ON FUNCTION platform.generate_embedding(p_text TEXT) IS 'Generate embedding from text (placeholder)';
COMMENT ON FUNCTION platform.generate_embeddings(p_texts TEXT[]) IS 'Batch generate embeddings';
COMMENT ON FUNCTION platform.update_embedding(p_table_name TEXT, p_id_column TEXT, p_id_value UUID, p_text_column TEXT, p_vector_column TEXT) IS 'Update embedding for a record';
COMMENT ON FUNCTION platform.normalize_vector(p_vector VECTOR) IS 'Normalize a vector';
COMMENT ON FUNCTION platform.vector_dimensions(p_vector VECTOR) IS 'Calculate vector dimensions';
COMMENT ON FUNCTION platform.vectors_compatible(p_vector1 VECTOR, p_vector2 VECTOR) IS 'Check if vectors are compatible';
COMMENT ON FUNCTION platform.average_vectors(p_vectors VECTOR[]) IS 'Average multiple vectors';
COMMENT ON FUNCTION platform.get_vector_stats(p_table_name TEXT, p_column_name TEXT) IS 'Get vector statistics for a table';
