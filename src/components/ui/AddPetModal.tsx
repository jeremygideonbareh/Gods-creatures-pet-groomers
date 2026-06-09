import { useState } from "react";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { designTokens } from "@/config/site-content";

const CREATE_PET = gql`
  mutation CreatePetAfterLogin(
    $pet_name: String!
    $species: String!
    $breed: String!
    $age: Int
    $weight: numeric
    $coat_condition: String
    $medical_history: String
    $behavioral_notes: String
    $vet_contact: String
  ) {
    insert_pets_one(object: {
      pet_name: $pet_name
      species: $species
      breed: $breed
      age: $age
      weight: $weight
      coat_condition: $coat_condition
      medical_history: $medical_history
      behavioral_notes: $behavioral_notes
      vet_contact: $vet_contact
    }) { id }
  }
`;

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRAND_PINK = designTokens.brandPink;

export function AddPetModal({ isOpen, onClose }: AddPetModalProps) {
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [coatCondition, setCoatCondition] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [behavioralNotes, setBehavioralNotes] = useState("");
  const [vetContact, setVetContact] = useState("");
  const [loading, setLoading] = useState(false);
  const apolloClient = useApolloClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName) return;
    setLoading(true);
    try {
      await apolloClient.mutate({
        mutation: CREATE_PET,
        variables: {
          pet_name: petName,
          species: species || "Dog",
          breed,
          age: age ? parseInt(age, 10) : null,
          weight: weight ? parseFloat(weight) : null,
          coat_condition: coatCondition || null,
          medical_history: medicalHistory || null,
          behavioral_notes: behavioralNotes || null,
          vet_contact: vetContact || null,
        },
      });
      onClose();
    } catch (err) {
      console.error("Failed to create pet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
            className="relative w-full max-w-md rounded-3xl p-8 border border-white/20 overflow-y-auto max-h-[90vh]"
            style={{ backgroundColor: BRAND_PINK }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              🐾 Add Your Pet
            </h2>
            <p className="text-white/80 text-center mb-6">
              Tell us about your furry friend so we can serve you better!
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="addpet-name" className="sr-only">Pet name</label>
                <input
                  id="addpet-name"
                  type="text"
                  placeholder="Pet name *"
                  required
                  maxLength={100}
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="addpet-species" className="sr-only">Species</label>
                  <select
                    id="addpet-species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white outline-none focus:border-white/60"
                  >
                    <option value="" className="bg-[#d0999a] text-white">Species *</option>
                    <option value="Dog" className="bg-[#d0999a] text-white">Dog</option>
                    <option value="Cat" className="bg-[#d0999a] text-white">Cat</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="addpet-breed" className="sr-only">Breed</label>
                  <input
                    id="addpet-breed"
                    type="text"
                    placeholder="Breed"
                    maxLength={100}
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="addpet-age" className="sr-only">Age (years)</label>
                  <input
                    id="addpet-age"
                    type="number"
                    placeholder="Age (years)"
                    min={0}
                    max={50}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="addpet-weight" className="sr-only">Weight (kg)</label>
                  <input
                    id="addpet-weight"
                    type="number"
                    placeholder="Weight (kg)"
                    min={0}
                    max={200}
                    step={0.1}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="addpet-coat" className="sr-only">Coat condition</label>
                <input
                  id="addpet-coat"
                  type="text"
                  placeholder="Coat condition (e.g., dry, shedding, healthy)"
                  maxLength={200}
                  value={coatCondition}
                  onChange={(e) => setCoatCondition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                />
              </div>
              <div>
                <label htmlFor="addpet-medical" className="sr-only">Medical history</label>
                <textarea
                  id="addpet-medical"
                  placeholder="Medical history (allergies, medications, conditions...)"
                  rows={2}
                  maxLength={500}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none"
                />
              </div>
              <div>
                <label htmlFor="addpet-behavior" className="sr-only">Behavioral notes</label>
                <textarea
                  id="addpet-behavior"
                  placeholder="Behavioral notes (anxious, energetic, shy...)"
                  rows={2}
                  maxLength={500}
                  value={behavioralNotes}
                  onChange={(e) => setBehavioralNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60 resize-none"
                />
              </div>
              <div>
                <label htmlFor="addpet-vet" className="sr-only">Vet contact</label>
                <input
                  id="addpet-vet"
                  type="text"
                  placeholder="Vet contact (name/clinic + phone)"
                  maxLength={200}
                  value={vetContact}
                  onChange={(e) => setVetContact(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 outline-none focus:border-white/60"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={loading || !petName}
                  className="flex-1 py-3 rounded-full bg-white font-semibold text-lg transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ color: BRAND_PINK }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "🐾 Save Pet"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddPetModal;
