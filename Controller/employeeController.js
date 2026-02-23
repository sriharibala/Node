const { Parser } = require('json2csv');
const Employee = require('../Model/EmployeeModel');
const moment = require("moment");

exports.createEmployee = async ( req, res ) => {
    
    try{

        const { name, email, mobile, role_id, shift, city } = req.body;

        
        const employee = new Employee({
            name,
            email,
            mobile,
            role_id,
            shift,
            city
        })

        const savedEmployee = await employee.save();


        if(savedEmployee){
            res.status(201).json({ message: 'Employee created successfully', employee: savedEmployee });
        }

    } catch(error){
        res.status(500).json({ error: error.message });    
    }
};

exports.getallemployees = async (req, res) => {
    try {
        const { page = 0, size = 10, search = "", startDate, endDate } = req.body;

        const pageNumber = parseInt(page) || 0;
        const pageSize = parseInt(size) || 10;
        const skip = pageNumber * pageSize;

        /* ===== Search Filter ===== */
        let searchQuery = {};

        if (search) {
            searchQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        /* ===== Date Filter (only if provided) ===== */
        if (startDate && endDate) {
            const start = moment(startDate, "DD-MM-YYYY")
                .startOf("day")
                .toDate();

            const end = moment(endDate, "DD-MM-YYYY")
                .endOf("day")
                .toDate();

            searchQuery.createdAt = { $gte: start, $lte: end };
        }

        const total = await Employee.countDocuments(searchQuery);

        const employees = await Employee.find(searchQuery)
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            ResponseObject: employees,
            pagination: {
                total,
                page: pageNumber,
                size: pageSize,
            }
        });

    } catch (error) {
        console.log("ERROR:", error);
        return res.status(500).json({
            IsSuccess: false,
            ResponseObject: "Something went wrong"
        });
    }
};


exports.exportEmployees = async (req, res) => {
    try{
        const { search = "", startDate, endDate } = req.query;

        /* ===== Search Filter ===== */
        let searchQuery = {};
        if (search) {
            searchQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        /* ===== Date Filter (only if provided) ===== */
        if (startDate && endDate) {
            const start = moment(startDate, "DD-MM-YYYY")
                .startOf("day")
                .toDate();

            const end = moment(endDate, "DD-MM-YYYY")
                .endOf("day")
                .toDate();
            searchQuery.createdAt = { $gte: start, $lte: end };
        }
        const date = moment().format("DD-MM-YYYY");
        const filename = `employees_${date}.csv`;
        const employees = await Employee.find(searchQuery).sort({ createdAt: -1 });
        const fields = ['name', 'email', 'mobile', 'role_id', 'shift', 'city', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(employees);
        res.header('Content-Type', 'text/csv');
        res.attachment(filename);
        return res.send(csv);

        res.status(200).json({
            IsSuccess: true,
            ResponseObject: "Exported successfully"
        });

    }catch(error){
        res.status(500).json(
            {
                IsSuccess: false,
                ResponseObject: "Something went wrong"
            }
        )
    }
}