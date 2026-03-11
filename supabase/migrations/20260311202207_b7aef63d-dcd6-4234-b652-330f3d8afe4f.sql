
-- Hide all chefs from public view by revoking kitchen_approved
UPDATE chefs SET kitchen_approved = false WHERE kitchen_approved = true;

-- Hide kitchen partners from public view
UPDATE kitchen_partners SET approved = false WHERE approved = true;

-- Hide restaurants from public view  
UPDATE restaurants SET approved = false WHERE approved = true;
