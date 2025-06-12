-- This SQL can be used to create your tables in Supabase
-- Run this in the Supabase SQL Editor

-- Create the inventory_entries table
CREATE TABLE IF NOT EXISTS inventory_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP NOT NULL,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  return_to VARCHAR(255),
  material_description TEXT NOT NULL,
  units VARCHAR(50),
  quantity NUMERIC(10, 2) NOT NULL,
  order_by VARCHAR(255),
  remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  status VARCHAR(20) DEFAULT 'completed' NOT NULL CHECK (status IN ('completed', 'pending', 'returned'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_material_description ON inventory_entries(material_description);
CREATE INDEX IF NOT EXISTS idx_status ON inventory_entries(status);
CREATE INDEX IF NOT EXISTS idx_date ON inventory_entries(date);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for automatic timestamps
DROP TRIGGER IF EXISTS set_updated_at ON inventory_entries;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON inventory_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional, remove this in production)
INSERT INTO inventory_entries (
  date,
  from_location,
  to_location,
  return_to,
  material_description,
  units,
  quantity,
  order_by,
  remark,
  status
) VALUES
(NOW(), 'Warehouse A', 'Site B', 'Warehouse A', 'Steel Rods 12mm', 'Bundles', 20, 'John Doe', 'Urgent delivery', 'completed'),
(NOW() - interval '2 days', 'Supplier XYZ', 'Warehouse A', NULL, 'Cement Bags', 'Bags', 100, 'Jane Smith', 'Delivery completed', 'completed'),
(NOW() - interval '1 day', 'Warehouse A', 'Site C', NULL, 'Bricks', 'Pieces', 2000, 'Mike Johnson', 'For foundation work', 'pending'),
(NOW() - interval '5 days', 'Site B', 'Warehouse A', NULL, 'Unused Paint', 'Gallons', 5, 'Sarah Williams', 'Returned unused material', 'returned');
