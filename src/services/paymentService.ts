import { supabase } from '../lib/supabase';

interface Payment {
  order_id: string;
  amount: number;
  payment_date: string;
  payment_mode: string;
  reference_number?: string;
  notes?: string;
}

export const createPayment = async (payment: Payment) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};