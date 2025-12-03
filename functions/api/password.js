export async function onRequestPut(context) {
    const { request, env } = context;
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // 현재 비밀번호 확인
        const admin = await env['7one-line-db'].prepare(
            'SELECT * FROM admin WHERE password = ? LIMIT 1'
        ).bind(currentPassword).first();

        if (!admin) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: '현재 비밀번호가 올바르지 않습니다.' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 비밀번호 업데이트 (첫 번째 관리자 계정의 비밀번호 변경)
        await env['7one-line-db'].prepare(
            'UPDATE admin SET password = ? WHERE id = ?'
        ).bind(newPassword, admin.id).run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: '비밀번호가 변경되었습니다.' 
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '비밀번호 변경 중 오류가 발생했습니다.' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

