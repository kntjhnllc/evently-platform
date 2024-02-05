import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { IEvent } from '@/lib/database/models/event.model'

import { loadStripe } from '@stripe/stripe-js';
import { checkoutOrder, getOrdersByUser } from '@/lib/actions/order.actions';
import { IOrder } from '@/lib/database/models/order.model';

loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout =  ({ event, userId} : { event : IEvent, userId : string}) => {
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, []);
  
const onCheckout = async () => {
    const order = {
        eventTitle : event.title,
        eventId : event._id,
        price : event.price,
        isFree : event.isFree,
        buyerId : userId
    }

    await checkoutOrder(order);
  }

  const [isPurchased, setIsPurchased] = useState(false);
  
  useEffect(() => {
    const fetchData = () => {
      getOrdersByUser({ userId, page: 1 })
        .then((orders) => {
          const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
          const purchased = orderedEvents.some((order: IOrder) => order._id === event._id);
          setIsPurchased(purchased);
        })
        .catch((error) => {
          // Handle errors here
          console.error('Error fetching data:', error);
        });
    };

    fetchData();
  }, [event._id, userId]);
  
  return (
    <form action={onCheckout} method='POST'>
        {isPurchased? (
          <p className='p-2 text-red-400'>You've already bought this ticket.</p>
        )
        :
        (<Button type='submit' role='link' size='lg' className='button sm:w-fit'>
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
    </Button>)}
    </form>
    
  )
}

export default Checkout
