// GET: 최신 링크 하나만 조회
export async function onRequestGet(context) {
    const { env } = context;

    try {
        const result = await env['7one-line-db'].prepare(
            'SELECT * FROM links ORDER BY updated_at DESC LIMIT 1'
        ).first();

        return new Response(JSON.stringify({ 
            success: true, 
            data: result || null
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '링크 조회 중 오류가 발생했습니다.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// PUT: 링크 등록 (최신 링크로 저장)
export async function onRequestPut(context) {
    const { request, env } = context;
    const { url } = await request.json();

    if (!url) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'url은 필수입니다.' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // 새 링크 추가 (항상 새로 추가)
        await env['7one-line-db'].prepare(
            'INSERT INTO links (url) VALUES (?)'
        ).bind(url).run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: '링크가 등록되었습니다.' 
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '링크 저장 중 오류가 발생했습니다.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// DELETE: 링크 삭제 (id로 삭제)
export async function onRequestDelete(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'id 파라미터가 필요합니다.' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // 링크가 존재하는지 확인
        const existing = await env['7one-line-db'].prepare(
            'SELECT * FROM links WHERE id = ?'
        ).bind(id).first();

        if (!existing) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: '링크를 찾을 수 없습니다.' 
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 링크 삭제
        await env['7one-line-db'].prepare(
            'DELETE FROM links WHERE id = ?'
        ).bind(id).run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: '링크가 삭제되었습니다.' 
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '링크 삭제 중 오류가 발생했습니다.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

