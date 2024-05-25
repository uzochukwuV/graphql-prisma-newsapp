import { extendType, idArg, intArg, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("description");
        t.nonNull.string("url");
        t.string("createdAt");
        t.string("postedById");
        t.field("postedBy", {
            type: "User",
            resolve(parent, args, context){
                
                return context.prisma.link
                .findUnique({ where: { id: parent.id } })
                .postedBy();
                
            }
        })
    },
})



export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feeds", {
            type: "Link",
            resolve(parent, args, context, info){
                return context.prisma.link.findMany() as any;
            }
        }),
        t.nonNull.field("getLink", {
            type: "Link",
            args: {
                id: nonNull(intArg()),
            },
            async resolve(parent, args, context){
                const {id} = args;
                
                const link =  await context.prisma.link.findUnique({where: {id: id!}})

                return link as any
            }
        })
    },
});





export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
                userId: nonNull(intArg()),
            },
           async resolve(parent, args, context){
                const {description, url, userId} = args;

                const newLink = context.prisma.link.create({
                    data: {
                        description,
                        url,
                        postedById: userId,
                    }
                })
                return newLink! as any;
            }
        }),

        t.nonNull.field("updateLink", {
            type: "Link",
            args: {
                id: nonNull(idArg()),
                description: stringArg(),
                url: stringArg()
            },
            async resolve(parent,args, context){
                const {id, description, url}= args;
                var num = Number(id);

                const updateLink =  await context.prisma.link.update({where:{id: num}, data: {description:description!, url: url! }})

                return updateLink as any;


            }
        })
    },
});


