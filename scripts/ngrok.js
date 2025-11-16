const ngrok = require('ngrok');
const { spawn } = require('child_process');
const http = require('http');

const PORT = process.env.PORT || 3000;
const NGROK_AUTH_TOKEN = process.env.NGROK_AUTH_TOKEN;

// Hàm kiểm tra xem server đã sẵn sàng chưa
function waitForServer(maxAttempts = 30, interval = 1000) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkServer = () => {
            const req = http.get(`http://localhost:${PORT}`, (res) => {
                resolve();
            });
            req.on('error', () => {
                attempts++;
                if (attempts >= maxAttempts) {
                    reject(new Error('Server không khởi động được trong thời gian quy định'));
                } else {
                    setTimeout(checkServer, interval);
                }
            });
        };
        checkServer();
    });
}

async function startNgrok() {
    let nextDev;
    try {
        console.log('🚀 Đang khởi động Next.js dev server...\n');

        // Khởi động Next.js dev server trước
        nextDev = spawn('npm', ['run', 'dev'], {
            stdio: 'pipe',
            shell: true,
        });

        // Hiển thị output của dev server
        nextDev.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        nextDev.stderr.on('data', (data) => {
            process.stderr.write(data);
        });

        // Đợi server khởi động
        console.log('⏳ Đang đợi server khởi động...\n');
        await waitForServer();

        // Nếu có auth token, set nó
        if (NGROK_AUTH_TOKEN) {
            await ngrok.authtoken(NGROK_AUTH_TOKEN);
        }

        // Khởi động ngrok tunnel
        console.log('\n🌐 Đang tạo ngrok tunnel...\n');
        const url = await ngrok.connect({
            addr: PORT,
            authtoken: NGROK_AUTH_TOKEN || undefined,
        });

        console.log('\n✅ Ngrok tunnel đã được tạo!');
        console.log('📍 Public URL:', url);
        console.log('\n📋 Bạn có thể share URL này với người khác');
        if (!NGROK_AUTH_TOKEN) {
            console.log('⚠️  Lưu ý: URL sẽ thay đổi mỗi lần khởi động lại');
            console.log('💡 Đăng ký tài khoản miễn phí tại https://dashboard.ngrok.com/ để có URL cố định\n');
        } else {
            console.log('✅ URL cố định với ngrok account\n');
        }

        // Xử lý khi dừng
        process.on('SIGINT', async () => {
            console.log('\n\n🛑 Đang dừng ngrok và dev server...');
            try {
                await ngrok.kill();
            } catch (e) {
                // Ignore errors when killing ngrok
            }
            if (nextDev) {
                nextDev.kill();
            }
            process.exit(0);
        });

        nextDev.on('close', async (code) => {
            try {
                await ngrok.kill();
            } catch (e) {
                // Ignore errors when killing ngrok
            }
            process.exit(code);
        });
    } catch (error) {
        console.error('\n❌ Lỗi:', error.message);
        if (error.message.includes('authtoken')) {
            console.log('\n💡 Tip: Để sử dụng ngrok, bạn cần:');
            console.log('   1. Đăng ký tài khoản miễn phí tại https://dashboard.ngrok.com/signup');
            console.log('   2. Lấy auth token tại https://dashboard.ngrok.com/get-started/your-authtoken');
            console.log('   3. Thêm vào .env.local: NGROK_AUTH_TOKEN=your_token');
        }
        if (nextDev) {
            nextDev.kill();
        }
        process.exit(1);
    }
}

startNgrok();
