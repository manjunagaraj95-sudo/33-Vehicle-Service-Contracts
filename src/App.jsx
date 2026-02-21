
import React, { useState, useEffect } from 'react';

// Centralized Status Definitions and Mappings
const STATUS_KEYS = {
    DRAFT: 'DRAFT',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    ACTIVE: 'ACTIVE',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
    IN_REVIEW: 'IN_REVIEW',
    PROCESSING: 'PROCESSING',
    PAID: 'PAID',
    UNDER_REVIEW: 'UNDER_REVIEW',
    COMPLETED: 'COMPLETED',
};

const STATUS_LABELS = {
    [STATUS_KEYS.DRAFT]: 'Draft',
    [STATUS_KEYS.PENDING_APPROVAL]: 'Pending Approval',
    [STATUS_KEYS.ACTIVE]: 'Active',
    [STATUS_KEYS.APPROVED]: 'Approved',
    [STATUS_KEYS.REJECTED]: 'Rejected',
    [STATUS_KEYS.CANCELLED]: 'Cancelled',
    [STATUS_KEYS.EXPIRED]: 'Expired',
    [STATUS_KEYS.IN_REVIEW]: 'In Review',
    [STATUS_KEYS.PROCESSING]: 'Processing',
    [STATUS_KEYS.PAID]: 'Paid',
    [STATUS_KEYS.UNDER_REVIEW]: 'Under Review',
    [STATUS_KEYS.COMPLETED]: 'Completed',
};

const STATUS_COLORS = {
    [STATUS_KEYS.DRAFT]: 'var(--status-draft)',
    [STATUS_KEYS.PENDING_APPROVAL]: 'var(--status-pending-approval)',
    [STATUS_KEYS.ACTIVE]: 'var(--status-active)',
    [STATUS_KEYS.APPROVED]: 'var(--status-approved)',
    [STATUS_KEYS.REJECTED]: 'var(--status-rejected)',
    [STATUS_KEYS.CANCELLED]: 'var(--status-cancelled)',
    [STATUS_KEYS.EXPIRED]: 'var(--status-expired)',
    [STATUS_KEYS.IN_REVIEW]: 'var(--status-in-review)',
    [STATUS_KEYS.PROCESSING]: 'var(--status-processing)',
    [STATUS_KEYS.PAID]: 'var(--status-paid)',
    [STATUS_KEYS.UNDER_REVIEW]: 'var(--status-in-review)',
    [STATUS_KEYS.COMPLETED]: 'var(--status-approved)',
};

// ROLES configuration for RBAC
const ROLES = {
    FI_PRODUCT_MANAGER: 'F&I Product Manager',
    CUSTOMER_SERVICE_REP: 'Customer Service Representative',
    DEALERSHIP_PORTAL_USER: 'Dealership Portal User',
    SYSTEM_ARCHITECT: 'System Architect',
    VEHICLE_OWNER: 'Vehicle Owner',
};

// Dummy Data
const DUMMY_CONTRACTS = [
    {
        id: 'C001', contractNumber: 'VSC-001-2023', planName: 'Premium Shield', vehicleVIN: 'VIN123456789ABC',
        customerName: 'Alice Johnson', status: STATUS_KEYS.ACTIVE, startDate: '2023-01-15', endDate: '2026-01-14',
        premium: 2500, term: '3 Years / 36,000 Miles', mileageAtSale: 15000,
        coveredComponents: ['Engine', 'Transmission', 'Drive Axle', 'AC', 'Electrical'],
        documents: [{ id: 'DOC001', name: 'Contract VSC-001.pdf', type: 'PDF', url: '#' }],
        auditLog: [
            { timestamp: '2023-01-15 10:00', user: 'System', action: 'Contract Initiated' },
            { timestamp: '2023-01-16 11:30', user: 'F&I Product Manager', action: 'Approved' },
        ],
        workflowStage: 'Contract Approved',
        slaStatus: 'On Track',
    },
    {
        id: 'C002', contractNumber: 'VSC-002-2023', planName: 'Basic Protection', vehicleVIN: 'VIN987654321XYZ',
        customerName: 'Bob Williams', status: STATUS_KEYS.PENDING_APPROVAL, startDate: '2023-02-01', endDate: '2026-02-01',
        premium: 1500, term: '3 Years / 36,000 Miles', mileageAtSale: 25000,
        coveredComponents: ['Engine', 'Transmission'],
        documents: [{ id: 'DOC002', name: 'Contract VSC-002.pdf', type: 'PDF', url: '#' }],
        auditLog: [
            { timestamp: '2023-02-01 09:15', user: 'Dealership User', action: 'Contract Initiated' },
        ],
        workflowStage: 'Underwriting Review',
        slaStatus: 'Approaching Breach',
    },
    {
        id: 'C003', contractNumber: 'VSC-003-2022', planName: 'Ultra Coverage', vehicleVIN: 'VIN112233445566',
        customerName: 'Charlie Brown', status: STATUS_KEYS.EXPIRED, startDate: '2022-03-01', endDate: '2025-03-01',
        premium: 3000, term: '3 Years / 36,000 Miles', mileageAtSale: 10000,
        coveredComponents: ['Engine', 'Transmission', 'Drive Axle', 'AC', 'Electrical', 'Brakes', 'Suspension'],
        documents: [{ id: 'DOC003', name: 'Contract VSC-003.pdf', type: 'PDF', url: '#' }],
        auditLog: [
            { timestamp: '2022-03-01 14:00', user: 'System', action: 'Contract Initiated' },
            { timestamp: '2025-03-01 00:00', user: 'System', action: 'Contract Expired' },
        ],
        workflowStage: 'Expired',
        slaStatus: 'N/A',
    },
    {
        id: 'C004', contractNumber: 'VSC-004-2023', planName: 'Elite Plan', vehicleVIN: 'VINABCDEF12345678',
        customerName: 'Diana Prince', status: STATUS_KEYS.ACTIVE, startDate: '2023-04-20', endDate: '2026-04-19',
        premium: 2800, term: '3 Years / 45,000 Miles', mileageAtSale: 5000,
        coveredComponents: ['All major components'],
        documents: [{ id: 'DOC004', name: 'Contract VSC-004.pdf', type: 'PDF', url: '#' }],
        auditLog: [
            { timestamp: '2023-04-20 09:00', user: 'System', action: 'Contract Initiated' },
            { timestamp: '2023-04-21 10:00', user: 'F&I Product Manager', action: 'Approved' },
        ],
        workflowStage: 'Contract Approved',
        slaStatus: 'On Track',
    },
    {
        id: 'C005', contractNumber: 'VSC-005-2023', planName: 'Standard Plus', vehicleVIN: 'VINFEDCBA98765432',
        customerName: 'Eve Harrington', status: STATUS_KEYS.CANCELLED, startDate: '2023-05-10', endDate: '2026-05-09',
        premium: 2000, term: '3 Years / 36,000 Miles', mileageAtSale: 20000,
        coveredComponents: ['Engine', 'Transmission', 'AC'],
        documents: [{ id: 'DOC005', name: 'Contract VSC-005.pdf', type: 'PDF', url: '#' }],
        auditLog: [
            { timestamp: '2023-05-10 12:00', user: 'System', action: 'Contract Initiated' },
            { timestamp: '2023-05-11 14:00', user: 'F&I Product Manager', action: 'Approved' },
            { timestamp: '2023-06-01 10:00', user: 'Customer Service Representative', action: 'Cancelled' },
        ],
        workflowStage: 'Cancelled',
        slaStatus: 'N/A',
    },
];

const DUMMY_CLAIMS = [
    {
        id: 'CLM001', claimNumber: 'CLAIM-2023-001', contractId: 'C001', vehicleVIN: 'VIN123456789ABC',
        issueDescription: 'Engine knocking noise during acceleration.', repairCostEstimate: 1200,
        status: STATUS_KEYS.IN_REVIEW, claimDate: '2023-07-01', fraudRiskScore: 'Low',
        documents: [{ id: 'CDOC001', name: 'Repair Estimate.pdf', type: 'PDF', url: '#' }],
        milestones: [
            { stage: 'Claim Filed', date: '2023-07-01', status: 'Completed' },
            { stage: 'Initial Review', date: '2023-07-02', status: 'Completed' },
            { stage: 'Adjudication', date: null, status: 'Pending' },
        ],
        auditLog: [
            { timestamp: '2023-07-01 09:00', user: 'Dealership User', action: 'Claim Filed' },
            { timestamp: '2023-07-02 10:30', user: 'System', action: 'AI Fraud Check: Low Risk' },
        ],
        adjudicatedAmount: null,
        workflowStage: 'Adjudication',
        slaStatus: 'On Track',
    },
    {
        id: 'CLM002', claimNumber: 'CLAIM-2023-002', contractId: 'C004', vehicleVIN: 'VINABCDEF12345678',
        issueDescription: 'AC blowing warm air, compressor failure.', repairCostEstimate: 800,
        status: STATUS_KEYS.APPROVED, claimDate: '2023-06-10', fraudRiskScore: 'Very Low',
        documents: [{ id: 'CDOC002', name: 'Repair Invoice.pdf', type: 'PDF', url: '#' }],
        milestones: [
            { stage: 'Claim Filed', date: '2023-06-10', status: 'Completed' },
            { stage: 'Initial Review', date: '2023-06-11', status: 'Completed' },
            { stage: 'Adjudication', date: '2023-06-12', status: 'Completed' },
            { stage: 'Payment Issued', date: '2023-06-15', status: 'Completed' },
        ],
        auditLog: [
            { timestamp: '2023-06-10 11:00', user: 'Dealership User', action: 'Claim Filed' },
            { timestamp: '2023-06-11 12:00', user: 'System', action: 'AI Fraud Check: Very Low Risk' },
            { timestamp: '2023-06-12 14:00', user: 'Customer Service Representative', action: 'Claim Approved' },
        ],
        adjudicatedAmount: 750,
        workflowStage: 'Payment Issued',
        slaStatus: 'On Track',
    },
    {
        id: 'CLM003', claimNumber: 'CLAIM-2023-003', contractId: 'C001', vehicleVIN: 'VIN123456789ABC',
        issueDescription: 'Brakes squeaking loudly, worn pads.', repairCostEstimate: 450,
        status: STATUS_KEYS.REJECTED, claimDate: '2023-05-20', fraudRiskScore: 'Medium',
        documents: [{ id: 'CDOC003', name: 'Mechanic Report.pdf', type: 'PDF', url: '#' }],
        milestones: [
            { stage: 'Claim Filed', date: '2023-05-20', status: 'Completed' },
            { stage: 'Initial Review', date: '2023-05-21', status: 'Completed' },
            { stage: 'Adjudication', date: '2023-05-22', status: 'Completed' },
        ],
        auditLog: [
            { timestamp: '2023-05-20 10:00', user: 'Dealership User', action: 'Claim Filed' },
            { timestamp: '2023-05-21 11:00', user: 'System', action: 'AI Fraud Check: Medium Risk' },
            { timestamp: '2023-05-22 13:00', user: 'Customer Service Representative', action: 'Claim Rejected - Not Covered' },
        ],
        adjudicatedAmount: 0,
        workflowStage: 'Rejected',
        slaStatus: 'Completed',
    },
    {
        id: 'CLM004', claimNumber: 'CLAIM-2023-004', contractId: 'C005', vehicleVIN: 'VINFEDCBA98765432',
        issueDescription: 'Power steering pump leaking.', repairCostEstimate: 600,
        status: STATUS_KEYS.PROCESSING, claimDate: '2023-08-05', fraudRiskScore: 'Low',
        documents: [{ id: 'CDOC004', name: 'Inspection Report.pdf', type: 'PDF', url: '#' }],
        milestones: [
            { stage: 'Claim Filed', date: '2023-08-05', status: 'Completed' },
            { stage: 'Initial Review', date: '2023-08-06', status: 'Completed' },
            { stage: 'Adjudication', date: null, status: 'Pending' },
        ],
        auditLog: [
            { timestamp: '2023-08-05 14:00', user: 'Dealership User', action: 'Claim Filed' },
            { timestamp: '2023-08-06 15:00', user: 'System', action: 'AI Fraud Check: Low Risk' },
        ],
        adjudicatedAmount: null,
        workflowStage: 'Adjudication',
        slaStatus: 'On Track',
    },
    {
        id: 'CLM005', claimNumber: 'CLAIM-2023-005', contractId: 'C002', vehicleVIN: 'VIN987654321XYZ',
        issueDescription: 'Transmission slipping in higher gears.', repairCostEstimate: 2500,
        status: STATUS_KEYS.PENDING_APPROVAL, claimDate: '2023-08-10', fraudRiskScore: 'High',
        documents: [{ id: 'CDOC005', name: 'Transmission Diagnostic.pdf', type: 'PDF', url: '#' }],
        milestones: [
            { stage: 'Claim Filed', date: '2023-08-10', status: 'Completed' },
            { stage: 'Initial Review', date: '2023-08-11', status: 'Completed' },
            { stage: 'Adjudication', date: null, status: 'Pending' },
        ],
        auditLog: [
            { timestamp: '2023-08-10 10:00', user: 'Dealership User', action: 'Claim Filed' },
            { timestamp: '2023-08-11 11:00', user: 'System', action: 'AI Fraud Check: High Risk' },
        ],
        adjudicatedAmount: null,
        workflowStage: 'Fraud Review',
        slaStatus: 'Breached',
    },
];

// Helper to find related data
const findContractById = (id) => DUMMY_CONTRACTS.find(c => c.id === id);
const findClaimsByContractId = (contractId) => DUMMY_CLAIMS.filter(c => c.contractId === contractId);

function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [currentUserRole, setCurrentUserRole] = useState(ROLES.FI_PRODUCT_MANAGER); // Default role
    const [pulsingKpi, setPulsingKpi] = useState(null); // For live update animation

    // Handlers for navigation and actions
    const navigate = (screen, params = {}) => {
        setView({ screen, params });
        window.scrollTo(0, 0); // Scroll to top on navigation
    };

    const logout = () => {
        // Implement actual logout logic here
        console.log('User logged out.');
        setCurrentUserRole(null); // Or redirect to login screen
        navigate('LOGIN'); // Placeholder for a login screen
    };

    const handleCreateContract = () => {
        // Placeholder for contract creation form
        console.log('Initiating contract creation.');
        // In a real app, this would open a form modal or navigate to a dedicated create page
        alert('Create Contract form would appear here!');
    };

    const handleProcessClaim = (claimId) => {
        // Placeholder for claim processing workflow
        console.log(`Processing claim: ${claimId}`);
        alert(`Workflow to process Claim ${claimId} would open here!`);
    };

    // Simulate real-time updates for KPI with pulse animation
    useEffect(() => {
        const interval = setInterval(() => {
            const kpiKeys = ['totalContracts', 'activeClaims']; // Example KPIs
            const randomKpiKey = kpiKeys[Math.floor(Math.random() * kpiKeys.length)];
            setPulsingKpi(randomKpiKey);
            setTimeout(() => setPulsingKpi(null), 1500); // Remove pulse after animation
        }, 5000); // Pulse every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Helper components to keep App.jsx concise
    const Header = ({ title, currentUserRole, onLogout, navigate }) => (
        <header className="app-header">
            <div className="header-left">
                <h1 className="header-title">{title}</h1>
                <span className="current-user-role">Role: {currentUserRole}</span>
            </div>
            <div className="header-right">
                <input type="text" placeholder="Global Search..." className="global-search-input" />
                <button className="button button-secondary" onClick={() => navigate('DASHBOARD')}>Dashboard</button>
                <button className="button button-secondary" onClick={() => navigate('CONTRACTS_LIST')}>Contracts</button>
                <button className="button button-secondary" onClick={() => navigate('CLAIMS_LIST')}>Claims</button>
                {(currentUserRole === ROLES.SYSTEM_ARCHITECT) && (
                    <button className="button button-secondary" onClick={() => navigate('USERS_MANAGEMENT')}>User Mgmt</button>
                )}
                <button className="button button-primary" onClick={onLogout}>Logout</button>
            </div>
        </header>
    );

    const Breadcrumbs = ({ path, navigate }) => (
        <nav className="breadcrumbs">
            {path.map((item, index) => (
                <span key={item.label} className="breadcrumb-item">
                    {(index > 0) && <span className="breadcrumb-separator">/</span>}
                    {item.screen ? (
                        <button className="breadcrumb-link" onClick={() => navigate(item.screen, item.params)}>
                            {item.label}
                        </button>
                    ) : (
                        <span className="breadcrumb-current">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );

    const Card = ({ title, subtitle, info, footer, status, onClick, children }) => (
        <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className="card-status-bar" style={{ backgroundColor: STATUS_COLORS[status] || 'var(--color-secondary)' }}></div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-subtitle">{subtitle}</p>
                {info?.map((item, index) => (
                    <p key={index} className="card-info">{item.label}: <strong>{item.value}</strong></p>
                ))}
                {children}
            </div>
            <div className="card-footer">
                <span>{footer?.left}</span>
                <span className="card-status-badge" style={{ backgroundColor: STATUS_COLORS[status] || 'var(--color-secondary)' }}>
                    {STATUS_LABELS[status] || status}
                </span>
            </div>
        </div>
    );

    // View Components
    const DashboardView = () => {
        // Dummy KPI Data (real-time, could be dynamic)
        const totalContracts = DUMMY_CONTRACTS.length;
        const activeContracts = DUMMY_CONTRACTS.filter(c => c.status === STATUS_KEYS.ACTIVE).length;
        const pendingClaims = DUMMY_CLAIMS.filter(c => c.status === STATUS_KEYS.IN_REVIEW || c.status === STATUS_KEYS.PENDING_APPROVAL).length;
        const totalClaims = DUMMY_CLAIMS.length;

        const kpis = [
            { id: 'totalContracts', title: 'Total Contracts', value: totalContracts, change: '+5% this month' },
            { id: 'activeContracts', title: 'Active Contracts', value: activeContracts, change: '-1% this month', negative: true },
            { id: 'pendingClaims', title: 'Pending Claims', value: pendingClaims, change: '+15% this month' },
            { id: 'totalClaims', title: 'Total Claims', value: totalClaims, change: '+8% this month' },
        ];

        const recentActivities = [
            { id: 1, text: 'Contract C004 Approved', timestamp: '2 minutes ago' },
            { id: 2, text: 'Claim CLM002 Paid', timestamp: '1 hour ago' },
            { id: 3, text: 'New contract VSC-006-2023 created', timestamp: 'Yesterday' },
            { id: 4, text: 'SLA Breach for Claim CLM005', timestamp: '2 days ago' },
            { id: 5, text: 'Customer Bob Williams updated profile', timestamp: '3 days ago' },
        ];

        return (
            <div className="dashboard-view">
                <h2>Dashboard Overview</h2>
                <div className="dashboard-grid">
                    {kpis.map(kpi => (
                        <div key={kpi.id} className={`kpi-card ${pulsingKpi === kpi.id ? 'pulse' : ''}`}>
                            <h3 className="kpi-title">{kpi.title}</h3>
                            <div className="kpi-value">{kpi.value}</div>
                            <div className={`kpi-change ${kpi.negative ? 'negative' : ''}`}>{kpi.change}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-charts">
                    <div className="chart-placeholder">Bar Chart Placeholder</div>
                    <div className="chart-placeholder">Line Chart Placeholder</div>
                    <div className="chart-placeholder">Donut Chart Placeholder</div>
                    <div className="chart-placeholder">Gauge Chart Placeholder</div>
                </div>

                <div className="recent-activities-panel">
                    <h3>Recent Activities</h3>
                    <div className="activity-list">
                        {recentActivities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <span className="activity-text">{activity.text}</span>
                                <span className="activity-timestamp">{activity.timestamp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const ContractsListView = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const filteredContracts = DUMMY_CONTRACTS.filter(contract =>
            contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.vehicleVIN.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="contracts-list-view">
                <Breadcrumbs path={[{ label: 'Dashboard', screen: 'DASHBOARD' }, { label: 'Vehicle Service Contracts' }]} navigate={navigate} />
                <div className="list-header">
                    <h2>Vehicle Service Contracts</h2>
                    <div className="list-actions">
                        <input
                            type="text"
                            placeholder="Search contracts..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {(currentUserRole === ROLES.FI_PRODUCT_MANAGER || currentUserRole === ROLES.DEALERSHIP_PORTAL_USER) && (
                            <button className="button button-primary" onClick={handleCreateContract}>
                                Create New Contract
                            </button>
                        )}
                        <button className="button button-outline">Filters</button>
                        <button className="button button-outline">Sort</button>
                        <button className="button button-outline">Export</button>
                    </div>
                </div>
                <div className="card-grid">
                    {filteredContracts.map(contract => (
                        <Card
                            key={contract.id}
                            title={contract.planName}
                            subtitle={contract.contractNumber}
                            info={[
                                { label: 'Customer', value: contract.customerName },
                                { label: 'Vehicle', value: contract.vehicleVIN },
                                { label: 'Term', value: contract.term },
                            ]}
                            footer={{ left: `Ends: ${contract.endDate}` }}
                            status={contract.status}
                            onClick={() => navigate('CONTRACT_DETAIL', { id: contract.id })}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const ContractDetailView = ({ id }) => {
        const contract = findContractById(id);

        if (!contract) {
            return (
                <div className="detail-page">
                    <Breadcrumbs path={[{ label: 'Dashboard', screen: 'DASHBOARD' }, { label: 'Contracts', screen: 'CONTRACTS_LIST' }, { label: 'Not Found' }]} navigate={navigate} />
                    <h2>Contract Not Found</h2>
                    <p>The contract with ID {id} could not be found.</p>
                </div>
            );
        }

        const relatedClaims = findClaimsByContractId(contract?.id);

        return (
            <div className="detail-page">
                <Breadcrumbs
                    path={[
                        { label: 'Dashboard', screen: 'DASHBOARD' },
                        { label: 'Contracts', screen: 'CONTRACTS_LIST' },
                        { label: contract?.contractNumber }
                    ]}
                    navigate={navigate}
                />
                <div className="detail-actions">
                    <h3>Contract: {contract?.contractNumber}</h3>
                    {(currentUserRole === ROLES.FI_PRODUCT_MANAGER) && (
                        <button className="button button-primary" onClick={() => alert(`Editing contract ${contract?.id}`)}>Edit Contract</button>
                    )}
                    {(currentUserRole === ROLES.CUSTOMER_SERVICE_REP) && (
                        <>
                            <button className="button button-secondary" onClick={() => alert(`Initiate Renewal for ${contract?.id}`)}>Initiate Renewal</button>
                            <button className="button button-outline" onClick={() => alert(`Initiate Cancellation for ${contract?.id}`)}>Cancel Contract</button>
                        </>
                    )}
                </div>

                <div className="detail-section">
                    <h4 className="detail-section-title">Contract Details</h4>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Plan Name</span>
                            <span className="detail-value">{contract?.planName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className="detail-badge" style={{ backgroundColor: STATUS_COLORS[contract?.status] || 'var(--color-secondary)' }}>
                                {STATUS_LABELS[contract?.status] || contract?.status}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Customer Name</span>
                            <span className="detail-value">{contract?.customerName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Vehicle VIN</span>
                            <span className="detail-value">{contract?.vehicleVIN}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Start Date</span>
                            <span className="detail-value">{contract?.startDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">End Date</span>
                            <span className="detail-value">{contract?.endDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Premium</span>
                            <span className="detail-value">${contract?.premium?.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Term</span>
                            <span className="detail-value">{contract?.term}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Mileage at Sale</span>
                            <span className="detail-value">{contract?.mileageAtSale?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4 className="detail-section-title">Coverage & Workflow</h4>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Covered Components</span>
                            <span className="detail-value">{contract?.coveredComponents?.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Current Workflow Stage</span>
                            <span className="detail-value">{contract?.workflowStage || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">SLA Status</span>
                            <span className="detail-badge" style={{ backgroundColor: (contract?.slaStatus === 'Breached' ? 'var(--color-danger)' : (contract?.slaStatus === 'On Track' ? 'var(--color-success)' : 'var(--color-warning)')) }}>
                                {contract?.slaStatus || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4 className="detail-section-title">Related Claims</h4>
                    {(relatedClaims?.length > 0) ? (
                        <div className="related-list">
                            {relatedClaims.map(claim => (
                                <div key={claim.id} className="related-item">
                                    <div className="related-item-content">
                                        <strong>{claim.claimNumber}</strong> - {claim.issueDescription}
                                        <p style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status: {STATUS_LABELS[claim.status]}</p>
                                    </div>
                                    <button className="button button-outline related-item-action" onClick={() => navigate('CLAIM_DETAIL', { id: claim.id })}>
                                        View Claim
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No claims found for this contract.</p>
                    )}
                </div>

                <div className="detail-section">
                    <h4 className="detail-section-title">Documents</h4>
                    {(contract?.documents?.length > 0) ? (
                        <div className="document-list">
                            {contract.documents.map(doc => (
                                <div key={doc.id} className="document-item">
                                    <span>{doc.name} ({doc.type})</span>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="related-item-action">View</a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No documents available.</p>
                    )}
                </div>

                {(currentUserRole === ROLES.SYSTEM_ARCHITECT) && (
                    <div className="detail-section">
                        <h4 className="detail-section-title">Audit Log</h4>
                        {(contract?.auditLog?.length > 0) ? (
                            <div className="audit-log-list">
                                {contract.auditLog.map((log, index) => (
                                    <div key={index} className="audit-log-item">
                                        <div className="audit-log-item-content">
                                            <strong>{log.timestamp}</strong> - {log.user}: {log.action}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No audit log entries.</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const ClaimsListView = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const filteredClaims = DUMMY_CLAIMS.filter(claim =>
            claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            claim.vehicleVIN.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="claims-list-view">
                <Breadcrumbs path={[{ label: 'Dashboard', screen: 'DASHBOARD' }, { label: 'Claims' }]} navigate={navigate} />
                <div className="list-header">
                    <h2>Vehicle Service Claims</h2>
                    <div className="list-actions">
                        <input
                            type="text"
                            placeholder="Search claims..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {(currentUserRole === ROLES.DEALERSHIP_PORTAL_USER) && (
                            <button className="button button-primary" onClick={() => alert('File a New Claim form')}>File New Claim</button>
                        )}
                        <button className="button button-outline">Filters</button>
                        <button className="button button-outline">Sort</button>
                        <button className="button button-outline">Export</button>
                    </div>
                </div>
                <div className="card-grid">
                    {filteredClaims.map(claim => (
                        <Card
                            key={claim.id}
                            title={claim.claimNumber}
                            subtitle={claim.issueDescription}
                            info={[
                                { label: 'Contract', value: claim.contractId },
                                { label: 'Vehicle', value: claim.vehicleVIN },
                                { label: 'Date', value: claim.claimDate },
                            ]}
                            footer={{ left: `Estimate: $${claim.repairCostEstimate?.toLocaleString()}` }}
                            status={claim.status}
                            onClick={() => navigate('CLAIM_DETAIL', { id: claim.id })}
                        >
                            {(claim.status === STATUS_KEYS.IN_REVIEW || claim.status === STATUS_KEYS.PENDING_APPROVAL) && (
                                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                    {(currentUserRole === ROLES.CUSTOMER_SERVICE_REP || currentUserRole === ROLES.FI_PRODUCT_MANAGER) && (
                                        <button className="button button-primary" onClick={(e) => { e.stopPropagation(); handleProcessClaim(claim.id); }}>
                                            Process Claim
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        );
    };

    const ClaimDetailView = ({ id }) => {
        const claim = DUMMY_CLAIMS.find(c => c.id === id);
        const associatedContract = claim?.contractId ? findContractById(claim.contractId) : null;

        if (!claim) {
            return (
                <div className="detail-page">
                    <Breadcrumbs path={[{ label: 'Dashboard', screen: 'DASHBOARD' }, { label: 'Claims', screen: 'CLAIMS_LIST' }, { label: 'Not Found' }]} navigate={navigate} />
                    <h2>Claim Not Found</h2>
                    <p>The claim with ID {id} could not be found.</p>
                </div>
            );
        }

        return (
            <div className="detail-page">
                <Breadcrumbs
                    path={[
                        { label: 'Dashboard', screen: 'DASHBOARD' },
                        { label: 'Claims', screen: 'CLAIMS_LIST' },
                        { label: claim?.claimNumber }
                    ]}
                    navigate={navigate}
                />
                <div className="detail-actions">
                    <h3>Claim: {claim?.claimNumber}</h3>
                    {(currentUserRole === ROLES.CUSTOMER_SERVICE_REP && (claim?.status === STATUS_KEYS.IN_REVIEW || claim?.status === STATUS_KEYS.PENDING_APPROVAL)) && (
                        <button className="button button-primary" onClick={() => handleProcessClaim(claim?.id)}>Adjudicate Claim</button>
                    )}
                    {(currentUserRole === ROLES.CUSTOMER_SERVICE_REP && claim?.status === STATUS_KEYS.REJECTED) && (
                        <button className="button button-secondary" onClick={() => alert(`Review appeal for claim ${claim?.id}`)}>Review Appeal</button>
                    )}
                </div>

                <div className="detail-section">
                    <h4 className="detail-section-title">Claim Details</h4>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Claim Number</span>
                            <span className="detail-value">{claim?.claimNumber}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className="detail-badge" style={{ backgroundColor: STATUS_COLORS[claim?.status] || 'var(--color-secondary)' }}>
                                {STATUS_LABELS[claim?.status] || claim?.status}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Contract ID</span>
                            <button className="breadcrumb-link" onClick={() => navigate('CONTRACT_DETAIL', { id: claim?.contractId })}>
                                {claim?.contractId} ({associatedContract?.contractNumber})
                            </button>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Vehicle VIN</span>
                            <span className="detail-value">{claim?.vehicleVIN}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Claim Date</span>
                            <span className="detail-value">{claim?.claimDate}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Fraud Risk Score</span>
                            <span className="detail-badge" style={{ backgroundColor: (claim?.fraudRiskScore === 'High' ? 'var(--color-danger)' : (claim?.fraudRiskScore === 'Medium' ? 'var(--color-warning)' : 'var(--color-success)')) }}>
                                {claim?.fraudRiskScore || 'N/A'}
                            </span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Repair Cost Estimate</span>
                            <span className="detail-value">${claim?.repairCostEstimate?.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Adjudicated Amount</span>
                            <span className="detail-value">{(claim?.adjudicatedAmount !== null && claim?.adjudicatedAmount !== undefined) ? `$${claim.adjudicatedAmount?.toLocaleString()}` : 'N/A'}</span>
                        </div>
                        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                            <span className="detail-label">Issue Description</span>
                            <p className="detail-value">{claim?.issueDescription}</p>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4 className="detail-section-title">Workflow & Milestones</h4>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span className="detail-label">Current Workflow Stage</span>
                            <span className="detail-value">{claim?.workflowStage || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">SLA Status</span>
                            <span className="detail-badge" style={{ backgroundColor: (claim?.slaStatus === 'Breached' ? 'var(--color-danger)' : (claim?.slaStatus === 'On Track' ? 'var(--color-success)' : 'var(--color-warning)')) }}>
                                {claim?.slaStatus || 'N/A'}
                            </span>
                        </div>
                    </div>
                    <h5 style={{ marginTop: 'var(--spacing-lg)' }}>Milestones</h5>
                    {(claim?.milestones?.length > 0) ? (
                        <div className="milestone-list">
                            {claim.milestones.map((milestone, index) => (
                                <div key={index} className="milestone-item">
                                    <div className="milestone-item-content">
                                        <strong>{milestone.stage}</strong> - {milestone.date || 'Pending'}
                                    </div>
                                    <span className="detail-badge" style={{ backgroundColor: (milestone.status === 'Completed' ? 'var(--color-success)' : 'var(--color-warning)') }}>
                                        {milestone.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No milestones tracked for this claim.</p>
                    )}
                </div>

                <div className="detail-section">
                    <h4 className="detail-section-title">Documents</h4>
                    {(claim?.documents?.length > 0) ? (
                        <div className="document-list">
                            {claim.documents.map(doc => (
                                <div key={doc.id} className="document-item">
                                    <span>{doc.name} ({doc.type})</span>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="related-item-action">View</a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No documents available.</p>
                    )}
                </div>

                {(currentUserRole === ROLES.SYSTEM_ARCHITECT) && (
                    <div className="detail-section">
                        <h4 className="detail-section-title">Audit Log</h4>
                        {(claim?.auditLog?.length > 0) ? (
                            <div className="audit-log-list">
                                {claim.auditLog.map((log, index) => (
                                    <div key={index} className="audit-log-item">
                                        <div className="audit-log-item-content">
                                            <strong>{log.timestamp}</strong> - {log.user}: {log.action}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No audit log entries.</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Main App render logic
    return (
        <div className="app-container">
            <Header title="VSC Management" currentUserRole={currentUserRole} onLogout={logout} navigate={navigate} />
            <main className="app-content">
                {(() => {
                    switch (view.screen) {
                        case 'DASHBOARD':
                            return <DashboardView />;
                        case 'CONTRACTS_LIST':
                            return <ContractsListView />;
                        case 'CONTRACT_DETAIL':
                            return (view.params?.id) ? <ContractDetailView id={view.params.id} /> : <div>Invalid Contract ID</div>;
                        case 'CLAIMS_LIST':
                            return <ClaimsListView />;
                        case 'CLAIM_DETAIL':
                            return (view.params?.id) ? <ClaimDetailView id={view.params.id} /> : <div>Invalid Claim ID</div>;
                        default:
                            return <DashboardView />;
                    }
                })()}
            </main>
        </div>
    );
}

export default App;