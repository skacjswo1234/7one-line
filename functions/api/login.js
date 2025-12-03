export async function onRequestPost(context) {
    const { request, env } = context;
    const { username, password } = await request.json();

    try {
        // admin 테이블에서 사용자 확인
        const result = await env['7one-line-db'].prepare(
            'SELECT * FROM admin WHERE username = ? AND password = ?'
        ).bind(username, password).first();

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
                message: '아이디 또는 비밀번호가 올바르지 않습니다.' 
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

