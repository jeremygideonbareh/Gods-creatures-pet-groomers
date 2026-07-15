import { gql } from "@apollo/client";

export const GET_USER_PETS = gql`
  query GetUserPets {
    pets(order_by: { created_at: desc }) {
      id
      name
      species
      breed
      age_years
      weight_kg
      coat_condition
      medical_history
      behavioral_notes
      vet_contact
      created_at
    }
  }
`;

export const INSERT_PET = gql`
  mutation InsertPet(
    $name: String!
    $species: String!
    $breed: String
    $age_years: Int
    $weight_kg: numeric
    $coat_condition: String
    $medical_history: String
    $behavioral_notes: String
    $vet_contact: String
  ) {
    insert_pets_one(object: {
      name: $name
      species: $species
      breed: $breed
      age_years: $age_years
      weight_kg: $weight_kg
      coat_condition: $coat_condition
      medical_history: $medical_history
      behavioral_notes: $behavioral_notes
      vet_contact: $vet_contact
    }) {
      id
    }
  }
`;

export const GET_ADMIN_BOOKINGS = gql`
  query GetAdminBookings {
    bookings(order_by: { created_at: desc }) {
      id
      customer_name
      email
      phone
      service
      preferred_date
      notes
      advance_paid
      transaction_id
      status
      created_at
      addons
      total_price
      pet {
        name
        breed
      }
    }
  }
`;

export const UPDATE_BOOKING_STATUS = gql`
  mutation UpdateBookingStatus($id: uuid!, $status: String!) {
    update_bookings_by_pk(
      pk_columns: { id: $id }
      _set: { status: $status }
    ) {
      id
      status
    }
  }
`;

export const UPDATE_BOOKING_PAYMENT_STATUS = gql`
  mutation UpdateBookingPaymentStatus($id: uuid!, $status: String!) {
    update_bookings_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
      id
      status
    }
  }
`;

export const UPDATE_BOOKING_PAYMENT_DETAILS = gql`
  mutation UpdateBookingPaymentDetails($id: uuid!, $status: String!, $transaction_id: String!, $advance_paid: numeric!) {
    update_bookings_by_pk(pk_columns: { id: $id }, _set: { status: $status, transaction_id: $transaction_id, advance_paid: $advance_paid }) {
      id
      status
      transaction_id
      advance_paid
    }
  }
`;

export const GET_SITE_CONTENT = gql`
  query GetSiteContent {
    site_content {
      section
      content
    }
  }
`;

export const CHECK_BOOKING_CONFLICT = gql`
  query CheckBookingConflict($service: String!, $preferred_date: date!) {
    bookings(
      where: {
        service: { _eq: $service }
        preferred_date: { _eq: $preferred_date }
        status: { _in: ["pending_verification", "confirmed"] }
      }
    ) {
      id
      status
    }
  }
`;
