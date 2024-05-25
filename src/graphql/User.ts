import { extendType, idArg, nonNull, objectType, stringArg } from "nexus";


export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.string("password");
        t.list.field("links", {
            type: "Link",
            resolve(parent, args, context){
                return context.prisma.user  // 3
                .findUnique({ where: { id: parent.id } })
                .links();
            }
        })
    },
});

export const UserQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users", {
            type: "User",
            resolve(parent, args, context, info){
                return context.prisma.user.findMany() as any;
            }
        }),
        t.nonNull.field("getUser", {
            type: "User",
            args: {
                id: nonNull(idArg()),
            },
            async resolve(parent, args, context){
                const {id} = args;
                var num = Number(id);
                const link =  await context.prisma.user.findUnique({where: {id: num}})

                return link as any
            }
        })
    },
});



export const UserMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("add", {
            type: "User",
            args: {
                name: nonNull(stringArg()),
                email: nonNull(stringArg()),
            },
           async resolve(parent, args, context){
                const {name, email} = args;

                const newLink = context.prisma.user.create({
                    data: {
                        name,
                        email,
                        
                        password: "no password"
                    
                    }
                })
                return newLink! as any;
            }
        }),

        t.nonNull.field("updateUser", {
            type: "User",
            args: {
                id: nonNull(idArg()),
                name: nonNull(stringArg()),
               
            },
            async resolve(parent,args, context){
                const {name, id}= args;
                

                const updateUser =  await context.prisma.user.update({where:{id: id}, data: {name }})

                return updateUser as any;


            }
        })
    },
});


