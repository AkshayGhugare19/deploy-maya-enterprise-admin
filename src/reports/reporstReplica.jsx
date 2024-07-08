import React, { Component, createRef, useState, useEffect } from 'react'
import { BreadcrumbDivider, BreadcrumbSection, Grid, Header, Image, Input, Menu, Search, Segment, Sticky } from 'semantic-ui-react'
import _ from 'lodash';
import { TbReportSearch } from 'react-icons/tb'
import { FaTrafficLight } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { GrOverview } from "react-icons/gr";
import { SlArrowRight } from "react-icons/sl";
import { Breadcrumb, Button, Sidebar } from 'semantic-ui-react';
const CardList = () => {
    const navigate = useNavigate()
    const cardData = [
        {
            icon: <TbReportSearch style={{ fontSize: '25px' }} />,
            title: 'Sales By Coupon',
            description: "Analyze sales dynamics with detailed insights into coupon performance.",
            onclick: '/dashboard/reports/coupons'
        },
        {
            icon: <GrOverview style={{ fontSize: '25px' }} />,
            title: 'Sales Overview',
            description: "Explore comprehensive insights into sales performance and trends effortlessly.",
            onclick: '/dashboard/reports/sales-overview'
        },
        {
            icon: <FaTrafficLight style={{ fontSize: '25px' }} />,
            title: 'Traffic Overview',
            description: "Gain insights into website traffic with comprehensive Google Analytics overview.",
            onclick: '/dashboard/reports/traffic-overview'
        },



    ];

    return (
        <Grid columns={4} doubling stackable style={{ justifyContent: "space-between", width: "100%",marginLeft:'0px' ,  gap: '10px',}}>
            {cardData.map((card, index) => (
                <Grid.Column className='settings-card' key={index} style={{ backgroundColor: "white", borderRadius: '10px', width: "32%" }}>

                    <Card
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                        onclick={card?.onclick}
                    />


                </Grid.Column>
            ))}
        </Grid>
    );
};

const Card = ({ icon, title, description, onclick }) => {
    return (
        <Link to={onclick} style={{ color: 'black' }}>
            <Grid.Column className='settings-card' style={{ display: 'flex', borderRadius: '10px', padding: '15px', cursor: 'pointer' }}>

                <div >
                    <h4>{title}</h4>
                    <div style={{ fontSize: '14.5px', fontWeight: '400' }}>{description}</div>
                </div>
                <div>{icon}</div>
            </Grid.Column>
        </Link>
    );
};


const ReportsReplica = () => {
    const contextRef = createRef()
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const sections = [
        { key: 'Dashboard', content: 'Dashboard', link: true },
        { key: 'Settings', content: 'Settings', active: true },
    ];
    const handleSearchChange = (e, { value }) => {
        setValue(value);
        console.log(value);
    };


    ;
    return (
        <div style={{ backgroundColor: '#F4F4F4',padding:'16px 24px',height:"200vh" }}  >
             <div className='' 
                        style={{ fontSize: '30px', fontWeight: '600', gap: '1.5rem' ,width:'100%'}}
                        >
                            <Breadcrumb  style={{ fontSize: "14px", fontWeight: 600 }}>
                                <BreadcrumbSection as={Link} to="/dashboard" style={{ color: "#0496FF" }}>Dashboard</BreadcrumbSection>
                                <BreadcrumbDivider icon='right chevron' />
                                <BreadcrumbSection active>Reports</BreadcrumbSection>
                            </Breadcrumb>
                        </div>

            <Sticky context={contextRef}>
                <Grid verticalAlign='middel'>
                    <Grid.Column floated='left' width={5}>

                       
                    </Grid.Column>
                    <Grid.Column floated='right' width={4}>
                        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'top' }}>
                            {/* <Search
                                input={{ icon: 'search', iconPosition: 'left' }}
                                onSearchChange={handleSearchChange}
                                value={value}
                                loading={isLoading}
                                placeholder='Search All Reports'
                            /> */}

                        </div>
                    </Grid.Column>
                </Grid>
            </Sticky>
            <div style={{ border: 'none', borderRadius: '10px', margin: '25px 0', padding: '' }}>
                {/* <div style={{ letterSpacing: '2px' }}>GENERAL</div> */}
                <CardList />


            </div>

        </div>
    )
}

export default ReportsReplica