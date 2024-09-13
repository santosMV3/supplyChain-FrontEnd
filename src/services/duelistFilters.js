let filterFields = []
export let filterFieldsUpdate = []

const filters = [
    ['orderStatus', 'Status', 'select'],
    ["salesRep", "Sales Rep"],
    ["competenceName", "Logistic Responsible"],
    ["custNumber","Cust. Number"],
    ["custName","Cust. Name"],
    ["docType","Document Type"],
    ["AGRegion","Region"],
    ["documentNumber","SO"],
    ["item","Item"],
    ["PONumber","PO Number"],
    ["openValueLocalCurrency","Open Value"],
    ["firstDate","First Date", "date"],
    ["schedIDate","Sched. L. Date", "date"],
    ["SOCreationDate","SO Creation Date", "date"],
    ["confDeliveryDate","Conf. Delivery Date", "date"],
    ["delay","Delay"],
    ["deliveryDate","Delivery Date", "date"],
    ["availabilityCustomerDelvDate","Customer Delv. Date", "date"],
    ["itemCategory","Categ"],
    ["purchNo","Purch. No."],
    ["producingCompany","Producing Company"],
    ["importNo","Import. No."],
    ["GRDate","GR. Date", "date"],
    ["GRQuantity","GR. Quantity"],
    ["materialNumber","Material Number"],
    ["materialDescript","Material Descript"],
    ["ordercode","Ordercode"],
    ["commQuantity","Comm. Quantity"],
    ["externalStock","External Stock"],
    ["deliveryBlock","Delivery Block"],
    ["termDescription","Payment"],
    ["incoterms","Incoterms"],
    ["route","Route"],
    ["spCarrierPartner","SP. Carrier Partner"],
    ["spName","Carrier"],
    ["confirmationTypeSC","Confirm. SC."],
    ["dateOfNotification","Date Of Notification", "date"],
    ["fullDelivery","Full. Delivery"],
    ["PCInvoice","PC. Invoice"],
    ["PCInvoiceDate","PC. Invoice Date", "date"],
    ["situation","Color", "select"],
    ["deliveryFactory","Delivery Factory"],
    ["importation","Importation"],
    ["previsionTrianom","ETA WAREHOUSE", "date"],
    ["previsionFatSystem","Est. NF. Date (sys)", "date"],
    ["materiaDays","Material Days"],
    ["deadLineFat","Dead Line Fat."],
    ["previsionWeek","Prevision Fat. (Week)"],
    ["externalService","Ext. Service", "boolean"],
    ["supplier","Supplier"],
    ["returnDays","Return Days"],
    ["releaseDate","3rd Party Sent Date", "date"],
    ["previsionDate","Prevision Date", "date"],
];

const filtersWithFieldToUpdate = [
    ['orderStatus', 'Status', 'select'],
    ["situation","Color", "select"],
    ["previsionTrianom","ETA WAREHOUSE", "date"],
    ["previsionWeek","Prevision Fat. (Week)", "select"],
    ["supplier","Supplier"],
    ["returnDays","Return Days", "number"],
    ["releaseDate","Release Date", "date"],
    ["previsionDate","Prevision Date", "date"],
    ["orderNote", "Note"]
];

filterFields = filterFields.concat(filters.sort((a, b) => a[1].toUpperCase() === b[1].toUpperCase() ? 0 : a[1].toUpperCase() > b[1].toUpperCase() ? 1 : -1));
filterFieldsUpdate = filterFieldsUpdate.concat(filtersWithFieldToUpdate.sort((a, b) => a[1].toUpperCase() === b[1].toUpperCase() ? 0 : a[1].toUpperCase() > b[1].toUpperCase() ? 1 : -1));

export const filterOnlyFields = filters.map((fieldItem) => fieldItem[1]);

export default filterFields;