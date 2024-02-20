"use server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import { metrics, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("categoryActions");
const meter = metrics.getMeter("getCategoriesAPICount");

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  return tracer.startActiveSpan(
    "categoryActions:createCategory",
    async (span) => {
      try {
        await connectToDatabase();

        const newCategory = await Category.create({ name: categoryName });

        span.setAttribute("categoryName", categoryName);

        return JSON.parse(JSON.stringify(newCategory));
      } catch (error) {
        span.setAttribute("createCategoryException", "something went wrong");
        span.recordException(String(error));
        handleError(error);
      } finally {
        span.end();
      }
    }
  );
};

export const getAllCategories = async () => {
  const counter = meter.createCounter("getAllCategories");
  return tracer.startActiveSpan(
    "categoryAction:getAllCategories",
    async (span) => {
      try {
        await connectToDatabase();

        const categories = await Category.find();

        span.setAttribute("fetchedCategories", "i fetched values here");

        return JSON.parse(JSON.stringify(categories));
      } catch (error) {
        span.recordException(String(error));
        handleError(error);
      } finally {
        counter.add(1);
        span.end();
      }
    }
  );
};
