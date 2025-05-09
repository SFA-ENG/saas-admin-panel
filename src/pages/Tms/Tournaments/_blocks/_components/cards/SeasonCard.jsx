import { Card, Row, Col, Form, Input, DatePicker, Button, Divider, Tooltip } from "antd";
import { CalendarPlus, Trash2, Medal, PlusCircle, Calendar, Clock } from "lucide-react";
import SportCard from "./SportCard";

const { RangePicker } = DatePicker;

/**
 * SeasonCard component for tournament seasons
 */
const SeasonCard = ({ season, removeSeason, seasons, seasonIndex, generateId }) => {
  const seasonId = `season_${seasonIndex}`;
  
  return (
    <Card 
      key={season.key} 
      className="mb-10 border border-blue-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden"
      headStyle={{ backgroundColor: "#EFF6FF", padding: "0.75rem 1rem" }}
      bodyStyle={{ padding: "1.25rem" }}
      title={
        <div className="flex items-center">
          <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
            <CalendarPlus size={18} className="text-blue-600" />
          </div>
          <span className="font-medium text-blue-800">Season {seasonIndex + 1}</span>
        </div>
      }
      extra={
        <Tooltip title={seasons.length === 1 ? "At least one season is required" : "Remove season"}>
          <Button 
            type="text" 
            danger 
            icon={<Trash2 size={16} />} 
            onClick={() => removeSeason(season.name)}
            className="hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0"
            disabled={seasons.length === 1}
          />
        </Tooltip>
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Form.Item
            {...season}
            name={[season.name, "season_name"]}
            label="Season Name"
            rules={[{ required: true, message: "Please enter season name" }]}
          >
            <Input 
              placeholder="e.g., Summer 2024" 
              className="rounded-lg h-10"
              prefix={<Calendar size={16} className="text-blue-500 mr-2" />}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            {...season}
            name={[season.name, "duration"]}
            label="Season Duration"
            rules={[{ required: true, message: "Please select season duration" }]}
          >
            <RangePicker 
              style={{ width: "100%" }} 
              className="rounded-lg h-10"
              suffixIcon={<Clock size={16} className="text-blue-500" />}
            />
          </Form.Item>
        </Col>

        {/* Sports Section */}
        <Col span={24}>
          <Divider orientation="left" className="my-2">
            <div className="flex items-center">
              <Medal size={16} className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Sports</span>
            </div>
          </Divider>
          
          <Form.List name={[season.name, "sports"]}>
            {(sports, { add: addSport, remove: removeSport }) => (
              <>
                {sports.map((sport, sportIndex) => (
                  <SportCard 
                    key={sport.key} 
                    sport={sport} 
                    removeSport={removeSport} 
                    sports={sports} 
                    sportIndex={sportIndex} 
                    seasonId={seasonId} 
                    generateId={generateId} 
                  />
                ))}
                
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => addSport({ id: generateId() })}
                    block
                    icon={<PlusCircle size={16} />}
                    className="hover:border-green-500 hover:text-green-500 rounded-lg h-10 mt-2"
                  >
                    Add Sport
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </Card>
  );
};

export default SeasonCard; 