alter table "public"."bookings" drop constraint "bookings_cabin_id_fkey";

alter table "public"."bookings" drop constraint "bookings_guest_id_fkey";

alter table "public"."cabins" drop column "image_url";

alter table "public"."cabins" add column "image" text;

alter table "public"."bookings" add constraint "bookings_cabin_id_fkey" FOREIGN KEY (cabin_id) REFERENCES cabins(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bookings" validate constraint "bookings_cabin_id_fkey";

alter table "public"."bookings" add constraint "bookings_guest_id_fkey" FOREIGN KEY (guest_id) REFERENCES guests(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."bookings" validate constraint "bookings_guest_id_fkey";

create policy "Enable create access for all users"
on "public"."cabins"
as permissive
for insert
to public
with check (true);


create policy "Enable delete access for all users"
on "public"."cabins"
as permissive
for delete
to public
using (true);


create policy "Enable update access for all users"
on "public"."cabins"
as permissive
for update
to public
using (true)
with check (true);



