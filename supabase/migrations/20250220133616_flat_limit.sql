/*
  # Initial Schema for LMNP Property Management

  1. New Tables
    - `properties`
      - Basic property information
      - Financial details
      - Status tracking
    - `tenants`
      - Tenant personal information
      - Contact details
    - `leases`
      - Links properties and tenants
      - Lease terms and conditions
    - `maintenance_requests`
      - Maintenance tracking
      - Cost and status management
    - `transactions`
      - Financial transactions
      - Automated rent tracking
      - Maintenance costs

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
*/

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  address text NOT NULL,
  type text NOT NULL,
  rooms integer NOT NULL,
  bathrooms integer NOT NULL,
  area text NOT NULL,
  status text NOT NULL DEFAULT 'Available',
  rent_amount decimal(10,2) NOT NULL,
  images text[] DEFAULT ARRAY[]::text[],
  description text,
  amenities text[] DEFAULT ARRAY[]::text[],
  user_id uuid REFERENCES auth.users(id)
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  user_id uuid REFERENCES auth.users(id)
);

-- Leases table
CREATE TABLE IF NOT EXISTS leases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  rent_amount decimal(10,2) NOT NULL,
  deposit_amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  user_id uuid REFERENCES auth.users(id)
);

-- Maintenance requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  description text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  assigned_to text,
  estimated_cost decimal(10,2),
  actual_cost decimal(10,2),
  completion_date date,
  user_id uuid REFERENCES auth.users(id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  lease_id uuid REFERENCES leases(id) ON DELETE CASCADE,
  maintenance_id uuid REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  user_id uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own properties"
ON properties FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tenants"
ON tenants FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own leases"
ON leases FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own maintenance requests"
ON maintenance_requests FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own transactions"
ON transactions FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);