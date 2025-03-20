import crypto from "crypto";
export default function createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = new Date(Date.now() + 600000).toISOString(); // 10 minutes
    return {resetToken, passwordResetExpires, passwordResetToken};
}