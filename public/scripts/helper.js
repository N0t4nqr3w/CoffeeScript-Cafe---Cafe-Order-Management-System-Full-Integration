export function cents_to_dollars(cents) {
  return (cents/100).toLocaleString("en-US", {style:"currency", currency:"USD"});
}

export function date_format(date) {
  return new Intl.DateTimeFormat('en-US',{
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'America/Chicago'
  }).format(new Date(date));
}