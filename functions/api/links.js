// GET: 모든 링크 조회
export async function onRequestGet(context) {
    const { env } = context;

    try {
        const result = await env['7one-line-db'].prepare(
            'SELECT * FROM links ORDER BY name'
        ).all();

        return new Response(JSON.stringify({ 
            success: true, 
            data: result.results 
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

// PUT: 링크 업데이트 또는 생성
export async function onRequestPut(context) {
    const { request, env } = context;
    const { name, url, description } = await request.json();

    if (!name || !url) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'name과 url은 필수입니다.' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // 링크가 존재하는지 확인
        const existing = await env['7one-line-db'].prepare(
            'SELECT * FROM links WHERE name = ?'
        ).bind(name).first();

        if (existing) {
            // 업데이트
            await env['7one-line-db'].prepare(
                'UPDATE links SET url = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ?'
            ).bind(url, description || null, name).run();
        } else {
            // 새로 생성
            await env['7one-line-db'].prepare(
                'INSERT INTO links (name, url, description) VALUES (?, ?, ?)'
            ).bind(name, url, description || null).run();
        }

        return new Response(JSON.stringify({ 
            success: true, 
            message: '링크가 저장되었습니다.' 
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

// DELETE: 링크 삭제
export async function onRequestDelete(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const name = url.searchParams.get('name');

    if (!name) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'name 파라미터가 필요합니다.' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // 링크가 존재하는지 확인
        const existing = await env['7one-line-db'].prepare(
            'SELECT * FROM links WHERE name = ?'
        ).bind(name).first();

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
            'DELETE FROM links WHERE name = ?'
        ).bind(name).run();

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

