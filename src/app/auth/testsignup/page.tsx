"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TestSignupPage() {
  const [role, setRole] = useState<"molt" | "mentor">("molt");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation du mot de passe
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      // Inscription via NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        role,
        name,
        isSignup: 'true', // doit être une chaîne car c'est passé comme credential
        redirect: false,
        callbackUrl: '/dashboard'
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Inscription</h1>
      <label>
        Rôle :
        <input
          type="radio"
          name="role"
          value="molt"
          checked={role === "molt"}
          onChange={() => setRole("molt")}
        />{" "}
        Molt
        <input
          type="radio"
          name="role"
          value="mentor"
          checked={role === "mentor"}
          onChange={() => setRole("mentor")}
        />{" "}
        Mentor
      </label>
      <label>
        Nom :
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Email :
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Mot de passe :
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">S&apos;inscrire</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
