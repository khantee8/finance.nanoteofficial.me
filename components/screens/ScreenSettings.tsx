"use client";
export function ScreenSettings() {
  return (
    <div className="col fadein">
      <div><h1 className="h-page">Admin Settings</h1><p className="h-page-sub">Firm preferences · role-based access · API keys</p></div>
      <div className="grid grid-2">
        <div className="card">
          <div className="card-head"><h3>Roles &amp; permissions</h3></div>
          <table className="tbl">
            <thead><tr><th>Role</th><th>Members</th><th>Permissions</th></tr></thead>
            <tbody>
              <tr><td>Senior Advisor</td><td>4</td><td>Full client read/write · recommendations</td></tr>
              <tr><td>Advisor</td><td>11</td><td>Own clients · view firm reports</td></tr>
              <tr><td>Compliance</td><td>2</td><td>Read-only · audit log · KYC</td></tr>
              <tr><td>Operations</td><td>3</td><td>Onboarding · documents · reports</td></tr>
              <tr><td>Client (portal)</td><td>120</td><td>Own portfolio · own goals · documents</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-head"><h3>Compliance &amp; data</h3></div>
          <div className="kvs" style={{ rowGap: 14 }}>
            <span className="k">Regulator</span><span className="v">SEC Thailand · BoT data feed</span>
            <span className="k">Data residency</span><span className="v">AWS Asia (Singapore) — encrypted at rest</span>
            <span className="k">PDPA framework</span><span className="v">Enabled · consent v2.4</span>
            <span className="k">AML provider</span><span className="v">Refinitiv World-Check (daily screen)</span>
            <span className="k">Session timeout</span><span className="v">15 minutes</span>
            <span className="k">2FA required</span><span className="v">Yes — all staff</span>
          </div>
        </div>
      </div>
    </div>
  );
}
