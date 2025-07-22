export class SharedUtil {

    static generateOtp(length: number): string {
        let otp = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          otp += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return otp;
    }

    static isTimeUp(last_date : Date, time : number) : boolean {
        const now : Date = new Date();
        const diff = now.getTime() - last_date.getTime();
        return  diff > time * 1000 * 60;
    }

    static addDaysToNow(days: number): Date {
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

}