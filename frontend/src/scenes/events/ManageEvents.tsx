import React, { useState } from 'react'
import { useValues } from 'kea'

import { hot } from 'react-hot-loader/root'
import { PageHeader } from 'lib/components/PageHeader'
import { Button, Table, Tabs, Tooltip } from 'antd'
import { userLogic } from 'scenes/userLogic'
import { ActionsTable } from 'scenes/actions/ActionsTable'
import { InfoCircleOutlined } from '@ant-design/icons'
import { EventUsageType } from '~/types'
import { keyMapping, PropertyKeyInfo } from 'lib/components/PropertyKeyInfo'

function PropertiesVolumeTable(): JSX.Element {
    const columns = [
        {
            title: 'Property',
            render: function PropName(item: EventUsageType) {
                return <PropertyKeyInfo value={item.key} />
            },
            sorter: (a: EventUsageType, b: EventUsageType) => ('' + a.key).localeCompare(b.key),
            defaultSortOrder: 'ascend',
        },
        {
            title: function VolumeTitle() {
                return (
                    <Tooltip
                        placement="right"
                        title="Total number of events that included this property in the last 30 days. Can be delayed by up to an hour."
                    >
                        30 day volume
                        <InfoCircleOutlined className="info-indicator" />
                    </Tooltip>
                )
            },
            dataIndex: 'volume',

            sorter: (a: EventUsageType, b: EventUsageType) =>
                a.volume == b.volume ? a.usage_count - b.usage_count : a.volume - b.volume,
        },
        {
            title: function QueriesTitle() {
                return (
                    <Tooltip
                        placement="right"
                        title="Number of queries in PostHog that included a filter on this property."
                    >
                        30 day queries
                        <InfoCircleOutlined className="info-indicator" />
                    </Tooltip>
                )
            },
            dataIndex: 'usage_count',
            sorter: (a: EventUsageType, b: EventUsageType) =>
                a.usage_count == b.usage_count ? a.volume - b.volume : a.usage_count - b.usage_count,
        },
    ]
    const { user } = useValues(userLogic)
    const [showPostHogProps, setShowPostHogProps] = useState(true)
    return (
        <div>
            <Button
                size="small"
                type={showPostHogProps ? 'primary' : 'default'}
                onClick={() => setShowPostHogProps(!showPostHogProps)}
            >
                {showPostHogProps ? 'Hide' : 'Show'} PostHog properties
            </Button>
            <br />
            <br />
            <Table
                dataSource={user?.team.event_properties_with_usage
                    .filter((item) => (keyMapping.event[item.key] ? showPostHogProps : true))
                    .filter((item) => (keyMapping.event[item.key] && keyMapping.event[item.key].hide ? false : true))}
                columns={columns}
                size="small"
                pagination={{ pageSize: 99999, hideOnSinglePage: true }}
            />
        </div>
    )
}

function EventsVolumeTable(): JSX.Element {
    const columns = [
        {
            title: 'Event',
            dataIndex: 'event',

            sorter: (a: EventUsageType, b: EventUsageType) => ('' + a.event).localeCompare(b.event),
        },
        {
            title: function VolumeTitle() {
                return (
                    <Tooltip
                        placement="right"
                        title="Total number of events over the last 30 days. Can be delayed by up to an hour."
                    >
                        30 day volume
                        <InfoCircleOutlined className="info-indicator" />
                    </Tooltip>
                )
            },
            dataIndex: 'volume',
            sorter: (a, b) => (a.volume == b.volume ? a.usage_count - b.usage_count : a.volume - b.volume),
        },
        {
            title: function QueriesTitle() {
                return (
                    <Tooltip
                        placement="right"
                        title="Number of queries in PostHog that included a filter on this event."
                    >
                        30 day queries
                        <InfoCircleOutlined className="info-indicator" />
                    </Tooltip>
                )
            },
            dataIndex: 'usage_count',
            sorter: (a, b) => (a.usage_count == b.usage_count ? a.volume - b.volume : a.usage_count - b.usage_count),
        },
    ]
    const { user } = useValues(userLogic)
    return (
        <Table
            dataSource={user?.team.event_names_with_usage}
            columns={columns}
            size="small"
            pagination={{ pageSize: 99999, hideOnSinglePage: true }}
        />
    )
}

export const ManageEvents = hot(_ManageEvents)
function _ManageEvents({}): JSX.Element {
    return (
        <div className="manage-events" data-attr="manage-events-table">
            <PageHeader title="Manage Events" />
            <Tabs tabPosition="top" animated={false}>
                <Tabs.TabPane tab="Synthetic Events" key="synthetic">
                    <ActionsTable />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Events" key="events">
                    <EventsVolumeTable />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Properties" key="properties">
                    <PropertiesVolumeTable />
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}
