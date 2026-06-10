
1. Admin should be able to acess admin platform to create/ manage products
  1.1 Save productID and priceId in Stripe system (Stripe returns productId and priceID)
  1.2 Save/modify images in Vercel Blob (Vercel blob returns url for each image)
  1.3 Save/update all product data related to the product (icluding productID, priceID, and image(s) url(s)) to MongoDB
  1.4 Delete product would requer admin to trigger deletion. 
  [To make the system cover egde cases, mark product as disabled first from the admin side, only then allow deletion.]
  First, product and price should be disabled in Stripe, then delete related images in Vercel Blob, then delete the record in MongoDB. 
  1.5 Admin should be able to update the status of an order (created, paid, proccessing, in-transit, delivered, cancelled, returned)


2. User should be able to access our website and view products.
2.1 User should be able to add any listed products to the cart.
2.2 User should be able to tigger checkout for the products in the cart.
2.3 If the checkout  is successful:
  - user is redirected to the success page
  - Stripe sends us notification (Stripe Webhooks) to our backend system:
    - we start to handle order (2.4)
    - we create an account for the user, or we attach the order to an existing user
  

2.4 We start to handle order: store order details in DB, update product stock, send email notificaiton to the user (Resend email provider)

2.5 The user receives an email that the order is created with information about products
2.6 If a new user, the user receives an email with a link to set up a password and complete account creation
2.7 User should be able to access their account on our plaform and view/modify their settings
2.8 User should be able to log in to their account and view and past orders
