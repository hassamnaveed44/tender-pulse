import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "bg-surface shadow-subtle border border-border rounded-lg",
          headerTitle: "text-text-primary font-bold text-xl",
          headerSubtitle: "text-text-secondary text-xs",
          formButtonPrimary:
            "bg-primary hover:bg-primary-hover text-white text-xs font-semibold normal-case shadow-none",
          formFieldInput:
            "border-border focus:border-primary rounded-md text-sm",
          footerActionLink: "text-accent hover:text-accent font-medium",
        },
      }}
      redirectUrl="/dashboard"
      signInUrl="/sign-in"
    />
  );
}
