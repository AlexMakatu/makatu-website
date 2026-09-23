import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Image from "next/image";
import type { CSSProperties } from "react";
import PrintButton from "@/app/(site)/organogram/PrintButton";

type Level =
  | "executive"
  | "senior-management"
  | "management"
  | "professional-services"
  | "operations";

type Department = {
  _id: string;
  title: string;
  description?: string;
  displayOrder?: number;
};

type Employee = {
  _id: string;
  fullName: string;
  position: string;
  leadershipLevel?: Level;
  location?: string;
  displayOrder?: number;
  reportsToId?: string;
  department?: Department;
  photo?: { asset?: { url?: string } };
};

type Team = {
  _id: string;
  title: string;
  location?: string;
  headCount?: number;
  displayOrder?: number;
  reportsToId?: string;
  department?: Department;
};

type Settings = {
  title?: string;
  introText?: string;
  showPhotos?: boolean;
  showDepartmentBreakdown?: boolean;
  showDownloadButton?: boolean;
};

type Data = {
  settings?: Settings;
  employees: Employee[];
  teams: Team[];
  departments: Department[];
};

type Node = {
  id: string;
  kind: "employee" | "team";
  employee?: Employee;
  team?: Team;
  children: Node[];
};

const query = groq`
{
  "settings": *[_type == "organogramSettings"][0]{
    title, introText, showPhotos, showDepartmentBreakdown, showDownloadButton
  },
  "employees": *[
    _type == "organogramEmployee" && active == true && showOnPublicPage == true
  ] | order(displayOrder asc, fullName asc){
    _id, fullName, position, leadershipLevel, location, displayOrder,
    "reportsToId": reportsTo->_id,
    department->{_id, title, description, displayOrder},
    photo{asset->{url}}
  },
  "teams": *[_type == "organogramTeam" && active == true]
    | order(displayOrder asc, title asc){
    _id, title, location, headCount, displayOrder,
    "reportsToId": reportsTo->_id,
    department->{_id, title, description, displayOrder}
  },
  "departments": *[_type == "organogramDepartment"]
    | order(displayOrder asc, title asc){
    _id, title, description, displayOrder
  }
}
`;

const levelNames: Record<Level, string> = {
  executive: "Executive",
  "senior-management": "Senior management",
  management: "Management",
  "professional-services": "Professional services",
  operations: "Operations",
};

const accents: Record<Level, string> = {
  executive: "#d4af37",
  "senior-management": "#6f55aa",
  management: "#9278c7",
  "professional-services": "#2f7d78",
  operations: "#d38b31",
};

function order<T extends { displayOrder?: number }>(items: T[]) {
  return [...items].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  );
}

function buildTree(employees: Employee[], teams: Team[]) {
  const map = new Map<string, Node>();
  const roots: Node[] = [];

  order(employees).forEach((employee) => {
    map.set(employee._id, {
      id: employee._id,
      kind: "employee",
      employee,
      children: [],
    });
  });

  order(employees).forEach((employee) => {
    const node = map.get(employee._id)!;
    const parent = employee.reportsToId
      ? map.get(employee.reportsToId)
      : undefined;

    if (parent && parent.id !== node.id) parent.children.push(node);
    else roots.push(node);
  });

  order(teams).forEach((team) => {
    const node: Node = {
      id: team._id,
      kind: "team",
      team,
      children: [],
    };
    const parent = team.reportsToId ? map.get(team.reportsToId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });

  return roots;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function OrgCard({ node, showPhotos }: { node: Node; showPhotos: boolean }) {
  if (node.kind === "team" && node.team) {
    return (
      <article className="org-card org-card--team p-4">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#311d60]/55">
              Workforce group
            </p>
            <h3 className="mt-1 truncate text-sm font-black text-slate-950">
              {node.team.title}
            </h3>
            <p className="mt-1 truncate text-[10px] text-slate-500">
              {[node.team.department?.title, node.team.location]
                .filter(Boolean)
                .join(" - ")}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-black leading-none text-[#311d60]">
              {node.team.headCount ?? 0}
            </p>
            <p className="mt-1 text-[9px] text-slate-500">members</p>
          </div>
        </div>
      </article>
    );
  }

  if (!node.employee) return null;

  const employee = node.employee;
  const level = employee.leadershipLevel ?? "operations";
  const executive = level === "executive";

  return (
    <article
      className={`org-card p-3 ${executive ? "org-card--executive" : ""}`}
      style={{ "--node-accent": accents[level] } as CSSProperties}
    >
      <div className="flex items-center gap-3">
        {showPhotos && employee.photo?.asset?.url ? (
          <Image
            src={employee.photo.asset.url}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-white/70 object-cover"
          />
        ) : (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-black ${
              executive
                ? "bg-white/15 text-white"
                : "bg-[#311d60]/10 text-[#311d60]"
            }`}
          >
            {initials(employee.fullName)}
          </div>
        )}

        <div className="min-w-0">
          <p
            className={`truncate text-[9px] font-black uppercase tracking-[0.14em] ${
              executive ? "text-white/65" : "text-[#311d60]/55"
            }`}
          >
            {employee.position}
          </p>
          <h3 className="mt-1 truncate text-sm font-black">
            {employee.fullName}
          </h3>
          <p
            className={`mt-1 truncate text-[10px] ${
              executive ? "text-white/65" : "text-slate-500"
            }`}
          >
            {employee.department?.title ?? levelNames[level]}
          </p>
        </div>
      </div>
    </article>
  );
}

function Branch({ node, showPhotos }: { node: Node; showPhotos: boolean }) {
  return (
    <li>
      <OrgCard node={node} showPhotos={showPhotos} />
      {node.children.length ? (
        <ul>
          {node.children.map((child) => (
            <Branch key={child.id} node={child} showPhotos={showPhotos} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ConnectedChart({ roots, showPhotos }: { roots: Node[]; showPhotos: boolean }) {
  if (!roots.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
        No public organogram records are available.
      </div>
    );
  }

  return (
    <div className="org-chart-scroll">
      <div className="org-tree-wrap min-w-max px-5 pb-7 pt-2">
        <ul className="org-tree">
          {roots.map((root) => (
            <Branch key={root.id} node={root} showPhotos={showPhotos} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {(Object.entries(levelNames) as [Level, string][]).map(([level, label]) => (
        <div key={level} className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accents[level] }} />
          {label}
        </div>
      ))}
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
        <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-[#311d60] bg-[#311d60]/5" />
        Workforce group
      </div>
    </div>
  );
}

export default async function OrganogramPage() {
  const data: Data = await client.fetch(query, {}, { cache: "no-store" });
  const settings = data.settings;
  const showPhotos = settings?.showPhotos ?? true;
  const roots = buildTree(data.employees, data.teams);
  const teamCapacity = data.teams.reduce(
    (total, team) => total + (team.headCount ?? 0),
    0,
  );
  const totalCapacity = data.employees.length + teamCapacity;

  return (
    <main className="organogram-print-root min-h-screen bg-[#f5f3fa]">
      <section className="mx-auto max-w-[1800px] px-5 py-8 print:max-w-none print:p-0">
        <header className="organogram-page-header overflow-hidden rounded-[30px] bg-[#311d60] text-white shadow-xl print:rounded-none print:shadow-none">
          <div className="relative p-7 md:p-10 print:p-6">
            <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full border-[60px] border-white/5" />
            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-[#d4af37]">
                  Makatu Business Enterprises
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl print:text-4xl">
                  {settings?.title ?? "Organisational Structure"}
                </h1>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-white/70 md:text-base">
                  {settings?.introText ??
                    "A clear view of leadership accountability, functional reporting and operational capacity."}
                </p>
              </div>
              <div className="print:hidden">
                {settings?.showDownloadButton !== false ? <PrintButton /> : null}
              </div>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-white/5 px-7 py-4 md:px-10 print:px-6">
            <Legend />
            <div className="flex gap-6 text-right">
              <div><p className="text-2xl font-black">{data.employees.length}</p><p className="text-[9px] uppercase tracking-wider text-white/55">People</p></div>
              <div><p className="text-2xl font-black">{teamCapacity}</p><p className="text-[9px] uppercase tracking-wider text-white/55">Team capacity</p></div>
              <div><p className="text-2xl font-black text-[#d4af37]">{totalCapacity}</p><p className="text-[9px] uppercase tracking-wider text-white/55">Total</p></div>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-[30px] border border-[#311d60]/10 bg-white px-4 py-7 shadow-sm print:mt-4 print:min-h-[205mm] print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <div className="mb-4 flex items-end justify-between gap-4 px-4 print:px-0">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#311d60]/50">Reporting structure</p>
              <h2 className="mt-1 text-2xl font-black text-[#311d60]">Leadership to Operations</h2>
            </div>
            <p className="hidden text-xs text-slate-400 md:block print:block">Reporting lines are maintained in Sanity</p>
          </div>
          <ConnectedChart roots={roots} showPhotos={showPhotos} />
        </section>

        {settings?.showDepartmentBreakdown !== false ? (
          <section className="mt-6 rounded-[30px] border border-[#311d60]/10 bg-white p-7 shadow-sm print:mt-0 print:min-h-[270mm] print:break-before-page print:rounded-none print:border-0 print:p-6 print:shadow-none">
            <div className="flex items-end justify-between border-b-2 border-[#311d60] pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#311d60]/50">Makatu Business Enterprises</p>
                <h2 className="mt-1 text-3xl font-black text-[#311d60]">Department & Workforce Overview</h2>
              </div>
              <p className="text-xs font-bold text-[#311d60]/45">Supporting schedule</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
              {data.departments.map((department) => {
                const people = data.employees.filter(
                  (employee) => employee.department?._id === department._id,
                );
                const teams = data.teams.filter(
                  (team) => team.department?._id === department._id,
                );
                const capacity = teams.reduce(
                  (sum, team) => sum + (team.headCount ?? 0),
                  0,
                );
                return (
                  <article key={department._id} className="organogram-print-card rounded-2xl border border-[#311d60]/10 p-5">
                    <h3 className="text-lg font-black text-[#311d60]">{department.title}</h3>
                    {department.description ? <p className="mt-2 text-xs leading-5 text-slate-500">{department.description}</p> : null}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[[people.length, "People"], [teams.length, "Groups"], [capacity, "Capacity"]].map(([value, label]) => (
                        <div key={label} className="rounded-xl bg-[#311d60]/5 p-3">
                          <p className="text-2xl font-black text-[#311d60]">{value}</p>
                          <p className="text-[9px] uppercase tracking-wide text-slate-500">{label}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4">
              {[[totalCapacity, "Total capacity"], [data.employees.length, "People listed"], [data.teams.length, "Workforce groups"], [data.departments.length, "Departments"]].map(([value, label], index) => (
                <div key={label} className={`rounded-2xl p-5 ${index === 0 ? "bg-[#311d60] text-white" : "border border-[#311d60]/10 bg-white text-[#311d60]"}`}>
                  <p className={`text-[9px] font-black uppercase tracking-[0.16em] ${index === 0 ? "text-white/60" : "text-slate-500"}`}>{label}</p>
                  <p className="mt-2 text-4xl font-black">{value}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
