import { defineField, defineType } from 'sanity';


//
// SET OF OPTIONS FOR LINKS IN INDIVIDUAL PROJECTS
//
export const socialProjectsType = defineType({
    name: 'socialprojects',
    title: 'Project Socials',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string'
      },
      {
        name: 'svgIcon',
        title: 'SVG Icon',
        type: 'inlineSvg',
      },
      {
        name: 'color',
        title: 'Color',
        type: 'color',
        options: {
          disableAlpha: true,
        },
        validation: Rule => Rule.required().error('Color is required'),
      },
    ],
  })

//
// SET OF CATEGORIES FOR PROJECTS
//
export const categoriesProjectsType = defineType({
  name: 'categoriesprojects',
  title: 'Project Categories',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'svgIcon',
      title: 'SVG Icon',
      type: 'inlineSvg',
    }
  ],
})

//
// PROJECTS SECTION
//
export const projectsType = defineType({
    name: 'projects',
    title: 'Projects',
    type: 'document',
    fields: [
        defineField({
            name: 'Name',
            type: 'string'
        }),
        defineField({
            name: 'Description',
            type: 'text'
        }),
        defineField({
            name: 'Category',
            type: 'reference',
            to: [{type: 'categoriesprojects'}]
        }),
        defineField({
            name: 'Images',
            type: 'array',
            of: [{
                type: 'image',
                options: { hotspot: true },
            }],
            options: { sortable: true }
        }),
        defineField({
            name: 'Links',
            type: 'array',
            of: [{
                name: 'LinkObj',
                type: 'object',
                fields: [{
                    name: 'Link',
                    type: 'url',
                    description: 'Link URL to the thing'
                }, {
                    name: 'LinkRef',
                    type: 'reference',
                    to: [{type: 'socialprojects'}]
                }]
            }]
        }),
    ]
})

//
// SET OF URLS TO MY SOCIAL MEDIA
//
export const socialType = defineType({
    name: 'social',
    title: 'Social Links',
    type: 'document',
    fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string'
        },
        {
          name: 'svgIcon',
          title: 'SVG Icon',
          type: 'inlineSvg',
        },
        {
          name: 'color',
          title: 'Color',
          type: 'color',
          options: {
            disableAlpha: true,
          },
          validation: Rule => Rule.required().error('Color is required'),
        },
        {
            name: 'url',
            title: 'URL',
            type: 'url'
        }
    ],
})

//
// MY EXPERIENCE SECTION
//
export const experienceType = defineType({
    name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
    },
    {
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: Rule => Rule.required().error('Start date is required'),
    },
    {
      name: 'isOngoing',
      title: 'Ongoing Experience',
      type: 'boolean',
      description: 'Check if this experience is ongoing',
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      hidden: ({ parent }) => parent?.isOngoing, 
      validation: Rule => Rule.custom((endDate, context) => {
        const { isOngoing, startDate } = context.parent;
        if (!isOngoing && !endDate) {
          return 'Please provide an end date or mark the experience as ongoing';
        }
        if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
          return 'End date cannot be earlier than start date';
        }
        return true;
      }),
    },
  ],
})

//
// MY SKILLS SECTION
//
export const skillsType = defineType({
  name: 'skills',
  title: 'Skills',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
        name: 'description',
        title: 'Description',
        type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, 
      },
    },
    {
      name: 'percentage',
      title: 'Percentage',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(100).warning('Value must be between 0 and 100'),
      description: 'Enter the percentage value (0-100)',
    },
  ],
})

//
// TESTIMONIALS SECTION
//
export const referencesType = defineType({
    name: 'references',
    title: 'References',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true, 
        },
      },
      {
        name: 'company',
        title: 'Company',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
    ],
})

//
// SET OF BRANDS, COMPANIES, ETC. I WORKED WITH IN SOME WAY
//
export const collaborationTypes = defineType({
    name: 'collaborations',
    title: 'Collaborations',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative text',
                  options: {
                    isHighlighted: true,
                  },
                },
            ],
        }
    ]
})

//
// EVERYTHING ELSE ON THE WEBSITE 
//
export const pagecontentTypes = defineType({
    name: 'pagecontent',
    title: 'Page Content',
    type: 'document',
    fields: [
        {
            name: 'headtext1',
            title: 'Header Text - first line',
            description: 'Small text below the name.',
            type: 'string'
        },
        {
          name: 'headtext2',
          title: 'Header Text - second line',
          description: 'Small text below the name.',
          type: 'string'
      },
      {
        name: 'headtext3',
        title: 'Header Text - third line',
        description: 'Small text below the name.',
        type: 'string'
    },
        {
            name: 'headimage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'years',
            title: 'Years of Experience',
            type: 'number'
        },
        {
            name: 'about',
            title: 'About Me',
            type: 'text'
        }, 
        {
            name: 'aboutimage',
            title: 'About Me Image',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'contact',
            title: 'Contact Info',
            type: 'object',
            fields: [
                {
                    name: 'phone',
                    title: 'Phone Number',
                    type: 'string'
                },
                {
                    name: 'email',
                    title: 'E-mail Address',
                    type: 'email'
                }
            ]
        }
    ]
})