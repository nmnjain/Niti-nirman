export type GenderType = 'Male' | 'Female' | 'Other';
export type LocationType = 'Urban' | 'Rural' | 'Semi-Urban';
export type YesNoType = 'Yes' | 'No';

export interface UserProfile {
  id?: string;
  name:string;
  email: string;
  gender: GenderType;
  age: number;
  location: LocationType;
  caste: string;
  disability: YesNoType;
  minority: YesNoType;
  student: YesNoType;
  bpl: YesNoType;
  income: number;
  created_at?: string;
  updated_at?: string;
  pincode: string;
  state: string;
  city:string;
  aadhar_verified:boolean;
}

export interface Scheme {
  id: string;
  scheme_name: string;
  name: string;
  description: string;
  benefits: string;
  gender: string;
  age_range: string;
  location: string;
  eligible_castes: string[];
  disability: string;
  minority: string;
  student: string;
  bpl: string;
  income_range: string;
  contact_info?: string;
}

export interface SchemeQuestion {
  id: string;
  scheme_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  order_number: number;
  created_at?: string;
}