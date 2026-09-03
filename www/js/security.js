
class Security {
    static init() {
        // শুধু কনসোল পরিষ্কার রাখি, কিন্তু debugger কল করা বন্ধ
        console.log('🛡️ Security: Safe mode enabled.');
        this.clearConsole();
    }

    static clearConsole() {
        // অতিরিক্ত ক্লিয়ার করলে ডিবাগ করা কঠিন হয়, তাই ১০ সেকেন্ড পর পর ক্লিয়ার করি
        setInterval(() => {
            console.clear();
        }, 10000);
    }
}
