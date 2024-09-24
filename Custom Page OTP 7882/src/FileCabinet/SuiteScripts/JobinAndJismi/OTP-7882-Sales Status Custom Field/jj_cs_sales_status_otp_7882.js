/**
 * 
 * 
 * OTP 7882 - Custom page for display sales order based on the status
 * 
 * 
 * ------------------------------------------------------------------------
 * 
 * Author : Jobin And Jismi IT Services
 * 
 * Date Created : 09 - September - 2024
 * 
 * Description : This script is for creating a Custom page for displaying sales order based on the status
 * 
 * 
 * 
 * ------------------------------------------------------------------------
 * 
 * 
 * 
 * 
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
    /**
     * @param{record} record
     * @param{search} search
     */
    function(record, search) {
       
        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
    
            let cur = scriptContext.currentRecord;
           
     
            filters = [['mainline', 'IS', 'T'], 'AND', [['status', 'anyof', 'SalesOrd:B'],'or',['status','anyof', 'SalesOrd:G']]];
            createSearchAndPopulate(); 
           
           
        
        function createSearchAndPopulate(){
            try{   
            var mySearch = search.create({
                title: "Sales Status",
                type: search.Type.SALES_ORDER,
                filters: filters,
                columns: ['internalid','entity', 'subsidiary','tranid','trandate','status','department','total','status','taxtotal','saleschannel']
            });
     
           
     
            let searchResult = mySearch.run().getRange({
                start: 0,
                end: 50
            });
        
            let lineCount = cur.getLineCount({ sublistId: 'salessublist' });
            for (let i = lineCount - 1; i >= 0; i--) {
                cur.removeLine({
                    sublistId: 'salessublist',
                    line: i,
                    ignoreRecalc: true
                });
            }
            searchResult.forEach((result, index) => {
                var Name = result.getText({ name: 'entity' });
                var subsidiary = result.getText({ name: 'subsidiary' });
                var docNumber = result.getValue({ name: 'tranid'});
                var txnDate = result.getValue({ name: 'trandate'});
                var department = result.getText({ name: 'department'});
               
                var total = result.getValue({ name: 'total'});
                var status = result.getValue({ name: 'status' });
                var taxTotal = result.getValue({ name: 'taxtotal'});
                var salesChannel = result.getText({ name: 'saleschannel'});
                var internalId = result.getValue({ name: 'internalid'});
     
                var subTotal = total-taxTotal;

                if (!taxTotal)
                    {
                        taxTotal = 0;
                    }
     
                cur.selectLine({
                    sublistId: 'salessublist',
                    line: index
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_name',
                    value: Name,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_subsidiary',
                    value: subsidiary,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_documentnumber',
                    value: docNumber,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_txndate',
                    value: txnDate,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_department',
                    value: department,
                    ignoreFieldChange: true
                });
           
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_total',
                    value: total,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_status',
                    value: status,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_taxtotal',
                    value: taxTotal,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_subtotal',
                    value: subTotal,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_saleschannel',
                    value: salesChannel,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_internalid',
                    value: internalId,
                    ignoreFieldChange: true
                });
                cur.commitLine({
                    sublistId : 'salessublist'
                });
     
            });
        }
        catch(error)
        {
            log.debug(error);
        }
        }
     
           
        }
     
        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
               
            let cur = scriptContext.currentRecord;

           
     
            let subsidiaryName = cur.getValue('custpage_subsidiaryfield');
            let customerName = cur.getValue('custpage_customerfield');
            let deptName = cur.getValue('custpage_departmentfield')
            let statusFilter = cur.getText('custpage_statusfield');

            applyFilterAndPopulate();




     function applyFilterAndPopulate(){

        try{
            if (statusFilter === 'Pending Fulfillment') {
                statusFilter = 'SalesOrd:B';
            }
            if (statusFilter === 'Billed') {
                statusFilter = 'SalesOrd:G';
            }
            if (statusFilter === 'Partially Fulfilled'){
                statusFilter = 'SalesOrd:D'
            }
            if (statusFilter === 'Pending Billing'){
                statusFilter = 'SalesOrd:F'
            }
     
     
            let filters = [['mainline', 'IS', 'T'], 'AND', [['status', 'anyof', 'SalesOrd:B'],'or',['status','anyof', 'SalesOrd:G']]];
            if(customerName){
                filters.push( 'AND',['customer.internalid', 'anyOf', customerName]);
               
            }
           
           
            if(subsidiaryName){
               filters.push('AND',['subsidiary.internalid', 'anyOf', subsidiaryName]);
            }
            console.log(filters);
            if(deptName){
               filters.push( 'AND', ['department.internalid', 'anyOf', deptName]);
            }
     
           
     
     
            if(statusFilter){
               filters.push('AND',['status', 'is', statusFilter]);
            }
        
     
            var mySearch = search.create({
                title: "Sales Status",
                type: search.Type.SALES_ORDER,
                filters: filters,
                columns: ['internalid','entity', 'subsidiary','tranid','trandate','status','department','total','status','taxtotal','saleschannel']
            });
     
           
     
            let searchResult = mySearch.run().getRange({
                start: 0,
                end: 50
            });
            let lineCount = cur.getLineCount({ sublistId: 'salessublist' });
            for (let i = lineCount - 1; i >= 0; i--) {
                cur.removeLine({
                    sublistId: 'salessublist',
                    line: i,
                    ignoreRecalc: true
                });
            }
            searchResult.forEach((result, index) => {
                var Name = result.getText({ name: 'entity' });
                var subsidiary = result.getText({ name: 'subsidiary' });
                var docNumber = result.getValue({ name: 'tranid'});
                var txnDate = result.getValue({ name: 'trandate'});
                var department = result.getText({ name: 'department'});
               
                var total = result.getValue({ name: 'total'});
                var status = result.getValue({ name: 'status' });
                var taxTotal = result.getValue({ name: 'taxtotal'});
                var salesChannel = result.getText({ name: 'saleschannel'});
                var internalId = result.getValue({ name: 'internalid'});
     
                var subTotal = total-taxTotal;


                if (!taxTotal)
                    {
                        taxTotal = 0;
                    }
       
     
                cur.selectLine({
                    sublistId: 'salessublist',
                    line: index
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_name',
                    value: Name,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_subsidiary',
                    value: subsidiary,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_documentnumber',
                    value: docNumber,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_txndate',
                    value: txnDate,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_department',
                    value: department,
                    ignoreFieldChange: true
                });
           
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_total',
                    value: total,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_status',
                    value: status,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_taxtotal',
                    value: taxTotal,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_subtotal',
                    value: subTotal,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_saleschannel',
                    value: salesChannel,
                    ignoreFieldChange: true
                });
                cur.setCurrentSublistValue({
                    sublistId: 'salessublist',
                    fieldId: 'custpage_internalid',
                    value: internalId,
                    ignoreFieldChange: true
                });
                cur.commitLine({
                    sublistId : 'salessublist'
                });
     
            });
        }
        catch(error)
        {
            log.debug(error);
        }
        }
               
        }
       
     
        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {
     
        }
     
        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {
     
        }
     
        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
     
        }
     
        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {
     
        }
     
        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {
     
        }
     
        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {
     
        }
     
        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {
     
        }
     
        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {
     
        }
     
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };
       
    });