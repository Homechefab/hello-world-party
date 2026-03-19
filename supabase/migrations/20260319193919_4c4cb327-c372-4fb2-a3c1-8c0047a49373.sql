DELETE FROM order_items WHERE dish_id IN (SELECT id FROM dishes);
DELETE FROM dish_weekly_schedule WHERE dish_id IN (SELECT id FROM dishes);
DELETE FROM dish_date_exceptions WHERE dish_id IN (SELECT id FROM dishes);
DELETE FROM dishes;