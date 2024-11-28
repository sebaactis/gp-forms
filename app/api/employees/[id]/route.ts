import { db } from "@/data/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {

    const { id } = params;

    const employee = await db.employee.findFirst({
        where: { id },
        include: {
          CompletedForm: true,
          form: {              
            include: {        
              questions: {      
                include: {
                  options: true
                }
              }
            }
          }
        }
      });

    return NextResponse.json(employee)
}