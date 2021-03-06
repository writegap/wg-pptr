import { FastifyPluginAsync } from "fastify";
import getPdf from "../libs/getPdf";
import { getPdfOpts } from "../schemas/get-pdf.schema";
import { IGetPdfBody } from "../types/get-pdf.interface";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get("/", async function () {
    return "Who are you?";
  });

  fastify.get<{ Querystring: IGetPdfBody }>(
    "/get-pdf",
    getPdfOpts,
    async function (request, reply) {
      const extractPdf = await getPdf({
        username: request.query.username,
        slug: request.query.slug,
      });

      /**
       * Get a filename from the request.query
       * if none is provided, the filename will be
       * generated randomly by Date.now()
       */
      const filename = request.query.filename ?? Date.now().toString();

      reply.header(
        "Content-Disposition",
        "attachment; filename=" + filename + ".pdf"
      );
      reply.type("application/pdf");
      reply.send(extractPdf);
    }
  );
};

export default root;
