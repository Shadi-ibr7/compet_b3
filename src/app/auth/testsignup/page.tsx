"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TestSignupPage() {
  const [role, setRole] = useState<"molt" | "mentor">("molt");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation du mot de passe
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      // Upload de la photo de profil si elle existe
      let photoUrl = "";
      if (profilePhoto) {
        const formData = new FormData();
        formData.append('file', profilePhoto);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Erreur lors de l\'upload de la photo');
        }

        const { url } = await uploadResponse.json();
        photoUrl = url;
      }
      // Inscription via NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        role,
        name,
        linkPhoto: photoUrl,
        isSignup: 'true',
        redirect: false,
        callbackUrl: '/dashboard'
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      
      router.push("/dashboard");
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Photo de profil:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setProfilePhoto(file);
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Rôle:</label>
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
      </div>
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
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {isLoading && <p className="text-blue-500 mt-4">Chargement en cours...</p>}
    </form>
  );
}
