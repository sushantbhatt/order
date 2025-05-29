import { supabase } from '../lib/supabase';
import { Payment } from '../types';

export const createPayment = async (payment: Partial<Payment>): Promise<Payment> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session?.session?.user) {
    throw new Error('Please log in to create a payment');
  }

  const { data, error } = await supabase
    .from('payments')
    .insert({
      order_id: payment.orderId,
      amount: payment.amount,
      payment_date: payment.paymentDate,
      payment_mode: payment.paymentMode,
      reference_number: payment.referenceNumber,
      notes: payment.notes,
      user_id: session.session.user.id
    })
    .select()
    .single();

  if (error) throw error;

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

  if (error) throw error;

  return (data || []).map(payment => ({
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

export const deletePayment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};