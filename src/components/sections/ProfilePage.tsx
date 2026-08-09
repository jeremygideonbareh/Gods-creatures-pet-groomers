import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowLeft, Loader2, Plus, PawPrint } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { designTokens } from "@/config/site-content";
import { GET_USER_PETS, INSERT_PET } from "@/lib/graphql";
import MyBookings from "@/components/MyBookings";

const BRAND_PINK = designTokens.brandPink;

function AddPetForm({ onDone }: { onDone: () => void }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const speciesRef = useRef<HTMLSelectElement>(null);
  const breedRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const coatRef = useRef<HTMLTextAreaElement>(null);
  const medicalRef = useRef<HTMLTextAreaElement>(null);
  const behaviorRef = useRef<HTMLTextAreaElement>(null);
  const vetRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [createPet, { loading }] = useMutation(INSERT_PET, {
    refetchQueries: [{ query: GET_USER_PETS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { error: mutationError } = await createPet({
        variables: {
          name: nameRef.current?.value || "",
          species: speciesRef.current?.value || "",
          breed: breedRef.current?.value || null,
          age_years: ageRef.current?.value ? parseInt(ageRef.current.value, 10) : null,
          weight_kg: weightRef.current?.value ? parseFloat(weightRef.current.value) : null,
          coat_condition: coatRef.current?.value || null,
          medical_history: medicalRef.current?.value || null,
          behavioral_notes: behaviorRef.current?.value || null,
          vet_contact: vetRef.current?.value || null,
        },
      });
      if (mutationError) throw new Error(mutationError.message);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add pet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="pet-name" className="text-white/70 text-xs block mb-1">Pet Name *</label>
          <input id="pet-name" ref={nameRef} required maxLength={100} placeholder="e.g. Bruno" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 text-sm" />
        </div>
        <div>
          <label htmlFor="pet-species" className="text-white/70 text-xs block mb-1">Species *</label>
          <select id="pet-species" ref={speciesRef} required className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60 text-sm">
            <option value="Dog" className="bg-[#d0999a]">Dog</option>
            <option value="Cat" className="bg-[#d0999a]">Cat</option>
          </select>
        </div>
        <div>
          <label htmlFor="pet-breed" className="text-white/70 text-xs block mb-1">Breed</label>
          <input id="pet-breed" ref={breedRef} maxLength={100} placeholder="e.g. Golden Retriever" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 text-sm" />
        </div>
        <div>
          <label htmlFor="pet-age" className="text-white/70 text-xs block mb-1">Age (years)</label>
          <input id="pet-age" ref={ageRef} type="number" min={0} max={50} placeholder="e.g. 3" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 text-sm" />
        </div>
        <div>
          <label htmlFor="pet-weight" className="text-white/70 text-xs block mb-1">Weight (kg)</label>
          <input id="pet-weight" ref={weightRef} type="number" min={0} step={0.1} placeholder="e.g. 25.5" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 text-sm" />
        </div>
        <div>
          <label htmlFor="pet-vet" className="text-white/70 text-xs block mb-1">Vet Contact</label>
          <input id="pet-vet" ref={vetRef} maxLength={200} placeholder="Vet name & phone" className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="pet-coat" className="text-white/70 text-xs block mb-1">Coat Condition</label>
        <textarea id="pet-coat" ref={coatRef} rows={2} maxLength={500} placeholder="e.g. Dry, shedding, matted..." className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none text-sm" />
      </div>
      <div>
        <label htmlFor="pet-medical" className="text-white/70 text-xs block mb-1">Medical History / Allergies</label>
        <textarea id="pet-medical" ref={medicalRef} rows={2} maxLength={1000} placeholder="Allergies, medications, conditions..." className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none text-sm" />
      </div>
      <div>
        <label htmlFor="pet-behavior" className="text-white/70 text-xs block mb-1">Behavioral Notes</label>
        <textarea id="pet-behavior" ref={behaviorRef} rows={2} maxLength={1000} placeholder="Anxieties, aggression triggers, special handling..." className="w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none text-sm" />
      </div>
      {error && <p role="alert" className="text-red-200 text-sm bg-red-500/20 rounded-lg p-2">{error}</p>}
      <button type="submit" disabled={loading} className="w-full py-2.5 rounded-full bg-white font-semibold text-sm transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ color: BRAND_PINK }}>
        {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <>🐾 Add Pet</>}
      </button>
    </form>
  );
}

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  age_years: number | null;
  weight_kg: number | null;
  coat_condition: string | null;
  medical_history: string | null;
  behavioral_notes: string | null;
  vet_contact: string | null;
  created_at: string;
}

interface PetsData {
  pets: Pet[];
}

export function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error } = useQuery<PetsData>(GET_USER_PETS, { skip: !user });

  useEffect(() => {
    if (!authLoading && !user) navigate("/", { replace: true });
  }, [authLoading, user, navigate]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_PINK }}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">My Pets</h1>
              <p className="text-white/60 text-sm mt-1">{user?.email}</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white font-semibold text-sm transition-transform hover:scale-105" style={{ color: BRAND_PINK }}>
              <Plus size={16} /> {showForm ? "Cancel" : "Add Pet"}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 bg-white/10 rounded-2xl p-4 md:p-6 border border-white/20">
              <h2 className="text-white font-semibold mb-4">🐾 New Pet</h2>
              <AddPetForm onDone={() => setShowForm(false)} />
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-white" />
            </div>
          )}

          {error && (
            <p className="text-red-200 text-sm text-center bg-red-500/20 rounded-lg p-3">
              Failed to load pets: {error.message}
            </p>
          )}

          {!loading && !error && data?.pets?.length === 0 && (
            <div className="text-center py-12">
              <PawPrint size={48} className="mx-auto text-white/30 mb-3" />
              <p className="text-white/60">No pets registered yet. Add your first pet!</p>
            </div>
          )}

          {!loading && data?.pets && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.pets.map((pet: Pet) => (
                <div key={pet.id} className="bg-white/15 rounded-2xl p-4 md:p-5 border border-white/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{pet.name}</h3>
                      <p className="text-white/50 text-xs">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""}</p>
                    </div>
                    <span className="text-white/30 text-xs">{pet.age_years ?? "—"} yrs</span>
                  </div>
                  <div className="space-y-1 text-xs text-white/60">
                    {pet.weight_kg != null && <p>⚖️ {pet.weight_kg} kg</p>}
                    {pet.coat_condition && <p>🧥 {pet.coat_condition}</p>}
                    {pet.medical_history && <p>💊 {pet.medical_history}</p>}
                    {pet.behavioral_notes && <p>🧠 {pet.behavioral_notes}</p>}
                    {pet.vet_contact && <p>🏥 {pet.vet_contact}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <MyBookings />
      </div>
    </div>
  );
}

export default ProfilePage;
