
# Project Title

NitiNirman: AI-Powered Platform for Simplified Access to Government Schemes



NitiNirman is an AI-driven platform designed to empower citizens, especially those in rural areas, by streamlining access to government schemes and services. The platform leverages advanced technologies like AI, blockchain, and API integrations to improve accessibility, efficiency, and user experience. Key features include tailored scheme recommendations based on user profiles, document verification via government APIs, blockchain-secured document storage, and a chatbot for essential scheme information. With a user-centric design, NitiNirman aims to bridge the gap between citizens and government resources, ensuring inclusivity and transparency.
## Deployment

To run this project locally

```bash
  npm run start
```

Create a .env file in root directory with

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY= 
VITE_SYSTEM_PROMPT= (system prompt for chatbot)
```

- Create tables in supabase 

First create this Enum types

```bash
-- Create gender type enum
CREATE TYPE public.gender_type AS ENUM (
    'male',
    'female',
    'other'
);

-- Create location type enum
CREATE TYPE public.location_type AS ENUM (
    'rural',
    'urban'
);

-- Create yes_no_anyone type enum
CREATE TYPE public.yes_no_anyone AS ENUM (
    'yes',
    'no',
    'anyone'
);
```

1. user_profiles 

``` bash
-- Create user_profiles table in the public schema
CREATE TABLE public.user_profiles (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    email CHARACTER VARYING NOT NULL,
    gender public.gender_type NOT NULL,
    age INTEGER NOT NULL,
    location public.location_type NOT NULL,
    caste CHARACTER VARYING NOT NULL,
    disability public.yes_no_anyone NOT NULL,
    minority public.yes_no_anyone NOT NULL,
    student public.yes_no_anyone NOT NULL,
    bpl public.yes_no_anyone NOT NULL,
    income NUMERIC NOT NULL,
    pincode TEXT NULL,
    state CHARACTER VARYING(100) NULL,
    city CHARACTER VARYING(100) NULL,
    aadhar_verified BOOLEAN NULL DEFAULT false,
    name CHARACTER VARYING(100) NULL,
    profile_photo TEXT NULL,
) TABLESPACE pg_default;

```

2. 



## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/naman-jain-352512250/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/Namxn27)


## Screenshots

[App Screenshot]
![Screenshot 2025-01-12 195257](https://github.com/user-attachments/assets/6170247b-be0b-4172-8bca-ce24d0b5301a)
![Screenshot 2025-01-12 195400](https://github.com/user-attachments/assets/3fb6f051-a23d-4b7e-8e87-6785edbc1ce7)
![Screenshot 2025-01-12 195411](https://github.com/user-attachments/assets/a247f380-44ca-4cdf-881f-d7698e36cdcd)
![Screenshot 2025-01-12 195515](https://github.com/user-attachments/assets/23b50f31-da1a-43b9-a43e-0089b1d3ce9f)









## Support

For support or any queries, email jainnaman2774@gmail.com 


    
