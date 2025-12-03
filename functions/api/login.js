export async function onRequestPost(context) {
    const { request, env } = context;
    const { password } = await request.json();

    if (!password) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '비밀번호를 입력해주세요.' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // admin 테이블에서 비밀번호만 비교
        const result = await env['7one-line-db'].prepare(
            'SELECT * FROM admin WHERE password = ? LIMIT 1'
        ).bind(password).first();

        if (result) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: '로그인 성공' 
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ 
                success: false, 
                message: '비밀번호가 올바르지 않습니다.' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

