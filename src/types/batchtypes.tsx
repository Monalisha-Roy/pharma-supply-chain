export enum BatchStatus {
    Created = "0",
    InTransit = "1",
    Delivered = "2",
    Verified = "3",
    Recalled = "4"
}

export interface Batch {
    batchId: number;
    status: BatchStatus;
    expiryDate: string;
}

export const statusMap: Record<BatchStatus, { label: string; color: string }> = {
    [BatchStatus.Created]: { label: "Created", color: "bg-yellow-100 text-yellow-800" },
    [BatchStatus.InTransit]: { label: "In Transit", color: "bg-orange-100 text-orange-800" },
    [BatchStatus.Delivered]: { label: "Delivered", color: "bg-blue-100 text-blue-800" },
    [BatchStatus.Verified]: { label: "Verified", color: "bg-green-100 text-green-800" },
    [BatchStatus.Recalled]: { label: "Recalled", color: "bg-red-100 text-red-800" }
};

export interface BatchDetails {
   batchID: number;
   drugName: string;
   quantity: number;
   manufacturingDate: string;
   expiryDate: string;
   status: BatchStatus | string; // Support both if needed
   manufacturer: string;
   distributor: string;
   healthcareProvider: string;
   qrCode?: string;
}