-- Add Tony Stark to the account table
INSERT INTO public.account
(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update Tony Stark to be an admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Delete Tony Stark
DELETE FROM public.account
WHERE account_id = 1;

-- Modify "GM Hummer to read "A huge interior"
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer' AND inv_make = 'GM';

-- Inner join to select make and model with classification of 'sport'
SELECT (i.inv_make, i.inv_model, c.classification_name) FROM public.inventory AS i
JOIN public.classification as c
ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';

-- Update image and thumbnail url to include '/vehicles/'
UPDATE public.inventory
SET 
	inv_image = REPLACE (inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE (inv_thumbnail, '/images/', '/images/vehicles/');
