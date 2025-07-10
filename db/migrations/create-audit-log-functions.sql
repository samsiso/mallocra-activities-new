-- Function to get top audit actions
CREATE OR REPLACE FUNCTION get_top_audit_actions(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(action TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.action,
        COUNT(*)::BIGINT as count
    FROM audit_logs al
    WHERE al.created_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY al.action
    ORDER BY count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get top audit users
CREATE OR REPLACE FUNCTION get_top_audit_users(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(user_id TEXT, user_name TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.user_id,
        COALESCE(al.user_name, 'Unknown')::TEXT as user_name,
        COUNT(*)::BIGINT as count
    FROM audit_logs al
    WHERE al.created_at >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY al.user_id, al.user_name
    ORDER BY count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get audit severity breakdown
CREATE OR REPLACE FUNCTION get_audit_severity_breakdown()
RETURNS TABLE(severity audit_severity, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.severity,
        COUNT(*)::BIGINT as count
    FROM audit_logs al
    WHERE al.created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY al.severity
    ORDER BY 
        CASE al.severity
            WHEN 'critical' THEN 1
            WHEN 'error' THEN 2
            WHEN 'warning' THEN 3
            WHEN 'info' THEN 4
        END;
END;
$$ LANGUAGE plpgsql;