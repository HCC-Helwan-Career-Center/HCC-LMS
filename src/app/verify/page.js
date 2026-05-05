import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import styles from "./verify.module.css";

export default async function VerifyPage(props) {
  const searchParams = await props.searchParams;
  const { token, email } = searchParams;
  let status = "pending";
  let message = "Verifying your account...";

  if (!token || !email) {
    status = "error";
    message = "Invalid verification link. Missing token or email.";
  } else {
    try {
      const record = await prisma.verificationToken.findUnique({
        where: {
          identifier_token: {
            identifier: email,
            token: token,
          },
        },
      });

      if (!record) {
        status = "error";
        message = "Invalid or expired verification link.";
      } else if (record.expires < new Date()) {
        status = "error";
        message = "Verification link has expired. Please register again or request a new link.";
      } else {
        // Valid token, activate user
        await prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        });

        // Delete the token
        await prisma.verificationToken.delete({
          where: {
            identifier_token: {
              identifier: email,
              token: token,
            },
          },
        });

        status = "success";
        message = "Your email has been successfully verified! You can now sign in.";
      }
    } catch (error) {
      console.error(error);
      status = "error";
      message = "An error occurred during verification.";
    }
  }

  return (
    <div className={styles.verifyPage}>
      <div className={styles.card}>
        {status === "success" ? (
          <CheckCircle2 size={64} className={styles.iconSuccess} />
        ) : status === "error" ? (
          <XCircle size={64} className={styles.iconError} />
        ) : (
          <div className={styles.spinner} />
        )}
        
        <h1>{status === "success" ? "Account Verified" : "Verification Failed"}</h1>
        <p>{message}</p>
        
        <Link href="/login" className={`btn btn-primary ${styles.btn}`}>
          Go to Login
        </Link>
      </div>
    </div>
  );
}
