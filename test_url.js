function fixPrismaUrl(url) {
  if (!url) return url;
  const match = url.match(/^(postgresql:\/\/[^:]+:)(.*)(@[^@]+:\d+\/.*)$/);
  if (match) {
    const prefix = match[1];
    let password = match[2];
    const suffix = match[3];
    
    if (password.includes("@")) {
      password = password.replace(/@/g, "%40");
      return `${prefix}${password}${suffix}`;
    }
  }
  return url;
}

const url1 = "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@aws-0-ca-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
const url2 = "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika@2020@aws-0-ca-central-1.pooler.supabase.com:5432/postgres";

console.log("URL1 Result: ", fixPrismaUrl(url1) === url1 ? "OK (Unchanged)" : "FAILED");
console.log("URL2 Result: ", fixPrismaUrl(url2) === url2.replace("Sathvika@2020", "Sathvika%402020") ? "OK (Fixed)" : "FAILED");
