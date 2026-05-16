alter table public.contacts
    add column if not exists whatsapp text,
    add column if not exists city text,
    add column if not exists birthday date,
    add column if not exists preferences text,
    add column if not exists allergies_or_needs text,
    add column if not exists business_lines_interest text[];

drop view if exists contacts_summary;

create view contacts_summary
with (security_invoker=on)
as
select
    co.*,
    jsonb_path_query_array(co.email_jsonb, '$[*].email')::text as email_fts,
    jsonb_path_query_array(co.phone_jsonb, '$[*].number')::text as phone_fts,
    c.name as company_name,
    count(distinct t.id) filter (where t.done_date is null) as nb_tasks
from
    contacts co
left join
    tasks t on co.id = t.contact_id
left join
    companies c on co.company_id = c.id
group by
    co.id, c.name;

drop function if exists public.merge_contacts(bigint, bigint);

create function public.merge_contacts(loser_id bigint, winner_id bigint)
returns bigint
language plpgsql
security invoker
set search_path to 'public'
as $$
declare
  winner_contact contacts%ROWTYPE;
  loser_contact contacts%ROWTYPE;
  deal_record RECORD;
  merged_emails jsonb;
  merged_phones jsonb;
  merged_tags bigint[];
  merged_business_lines_interest text[];
  winner_emails jsonb;
  loser_emails jsonb;
  winner_phones jsonb;
  loser_phones jsonb;
  email_map jsonb;
  phone_map jsonb;
begin
  select * into winner_contact from contacts where id = winner_id;
  select * into loser_contact from contacts where id = loser_id;

  if winner_contact is null or loser_contact is null then
    raise exception 'Contact not found';
  end if;

  update tasks set contact_id = winner_id where contact_id = loser_id;
  update contact_notes set contact_id = winner_id where contact_id = loser_id;

  for deal_record in
    select id, contact_ids
    from deals
    where contact_ids @> array[loser_id]
  loop
    update deals
    set contact_ids = (
      select array(
        select distinct unnest(
          array_remove(deal_record.contact_ids, loser_id) || array[winner_id]
        )
      )
    )
    where id = deal_record.id;
  end loop;

  winner_emails := coalesce(winner_contact.email_jsonb, '[]'::jsonb);
  loser_emails := coalesce(loser_contact.email_jsonb, '[]'::jsonb);
  email_map := '{}'::jsonb;

  if jsonb_array_length(winner_emails) > 0 then
    for i in 0..jsonb_array_length(winner_emails)-1 loop
      email_map := email_map || jsonb_build_object(
        winner_emails->i->>'email',
        winner_emails->i
      );
    end loop;
  end if;

  if jsonb_array_length(loser_emails) > 0 then
    for i in 0..jsonb_array_length(loser_emails)-1 loop
      if not email_map ? (loser_emails->i->>'email') then
        email_map := email_map || jsonb_build_object(
          loser_emails->i->>'email',
          loser_emails->i
        );
      end if;
    end loop;
  end if;

  merged_emails := (select jsonb_agg(value) from jsonb_each(email_map));
  merged_emails := coalesce(merged_emails, '[]'::jsonb);

  winner_phones := coalesce(winner_contact.phone_jsonb, '[]'::jsonb);
  loser_phones := coalesce(loser_contact.phone_jsonb, '[]'::jsonb);
  phone_map := '{}'::jsonb;

  if jsonb_array_length(winner_phones) > 0 then
    for i in 0..jsonb_array_length(winner_phones)-1 loop
      phone_map := phone_map || jsonb_build_object(
        winner_phones->i->>'number',
        winner_phones->i
      );
    end loop;
  end if;

  if jsonb_array_length(loser_phones) > 0 then
    for i in 0..jsonb_array_length(loser_phones)-1 loop
      if not phone_map ? (loser_phones->i->>'number') then
        phone_map := phone_map || jsonb_build_object(
          loser_phones->i->>'number',
          loser_phones->i
        );
      end if;
    end loop;
  end if;

  merged_phones := (select jsonb_agg(value) from jsonb_each(phone_map));
  merged_phones := coalesce(merged_phones, '[]'::jsonb);

  merged_tags := array(
    select distinct unnest(
      coalesce(winner_contact.tags, array[]::bigint[]) ||
      coalesce(loser_contact.tags, array[]::bigint[])
    )
  );

  merged_business_lines_interest := array(
    select distinct unnest(
      coalesce(winner_contact.business_lines_interest, array[]::text[]) ||
      coalesce(loser_contact.business_lines_interest, array[]::text[])
    )
  );

  update contacts set
    avatar = coalesce(winner_contact.avatar, loser_contact.avatar),
    gender = coalesce(winner_contact.gender, loser_contact.gender),
    first_name = coalesce(winner_contact.first_name, loser_contact.first_name),
    last_name = coalesce(winner_contact.last_name, loser_contact.last_name),
    title = coalesce(winner_contact.title, loser_contact.title),
    company_id = coalesce(winner_contact.company_id, loser_contact.company_id),
    email_jsonb = merged_emails,
    phone_jsonb = merged_phones,
    whatsapp = coalesce(nullif(winner_contact.whatsapp, ''), loser_contact.whatsapp),
    city = coalesce(nullif(winner_contact.city, ''), loser_contact.city),
    birthday = coalesce(winner_contact.birthday, loser_contact.birthday),
    preferences = coalesce(nullif(winner_contact.preferences, ''), loser_contact.preferences),
    allergies_or_needs = coalesce(nullif(winner_contact.allergies_or_needs, ''), loser_contact.allergies_or_needs),
    business_lines_interest = case
      when array_length(merged_business_lines_interest, 1) > 0 then merged_business_lines_interest
      else null
    end,
    linkedin_url = coalesce(winner_contact.linkedin_url, loser_contact.linkedin_url),
    background = coalesce(winner_contact.background, loser_contact.background),
    has_newsletter = coalesce(winner_contact.has_newsletter, loser_contact.has_newsletter),
    status = coalesce(winner_contact.status, loser_contact.status),
    first_seen = least(coalesce(winner_contact.first_seen, loser_contact.first_seen), coalesce(loser_contact.first_seen, winner_contact.first_seen)),
    last_seen = greatest(coalesce(winner_contact.last_seen, loser_contact.last_seen), coalesce(loser_contact.last_seen, winner_contact.last_seen)),
    sales_id = coalesce(winner_contact.sales_id, loser_contact.sales_id),
    tags = merged_tags
  where id = winner_id;

  delete from contacts where id = loser_id;

  return winner_id;
end;
$$;
