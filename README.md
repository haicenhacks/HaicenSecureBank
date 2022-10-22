# Secure Bank

## Start lab
Run the following commands in this directory.
```
npm install
node app.js
```

## Goal
The goal of this challenge is to steal money from the admin. 
Sadly, if we make a payment that does that, it needs to be verified with an ID that only the admin has.

## Solution
GUIDv1 is being used here. This generates IDs based on time.
This means we can create one payment where we know the ID and another where we don't in quick succession and then get a small enough brute-force space.
A tool such as [guidtool](https://github.com/intruder-io/guidtool) can be very helpful.

A full solution will be posted on [my blog](https://blog.haicen.me)

## Credits

I did not create this source code, I just modified it slightly and added an extra feature to more easily show the transaction ID's for the non-admin user.
I modified the code provided by PinkDraconian https://github.com/PinkDraconian/vulnerability-examples/tree/main/GUIDv1/SecureBank.
