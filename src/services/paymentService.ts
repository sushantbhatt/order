import { supabase } from '../lib/supabase';
import { Payment } from '../types';

interface CreatePaymentData {
  order_id: string;
  amount: number;
  payment_date: string;
  payment_mode: string;
  reference_number?: string;
  notes?: string;
}

export const createPayment = async (paymentData: CreatePaymentData): Promise<Payment> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session?.session?.user) {
    throw new Error('User must be logged in to create a payment');
  }

  const { data, error } = await supabase
    .from('payments')
    .insert({
      ...paymentData,
      user_id: session.session.user.id
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    orderId: data.order_id,
    amount: data.amount,
    paymentDate: data.payment_date,
    paymentMode: data.payment_mode,
    referenceNumber: data.reference_number,
    notes: data.notes,
    createdAt: data.created_at
  };
};

export const getPaymentsByOrderId = async (orderId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .order('payment_date', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(payment => ({
    id: payment.id,
    orderId: payment.order_id,
    amount: payment.amount,
    paymentDate: payment.payment_date,
    paymentMode: payment.payment_mode,
    referenceNumber: payment.reference_number,
    notes: payment.notes,
    createdAt: payment.created_at
  }));
};