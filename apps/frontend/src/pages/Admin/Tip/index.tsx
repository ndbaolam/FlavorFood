import React, { useState } from 'react';
import { TipsItem } from '../../Tips/Tip.interface';
import { SquarePlus, Trash2, PencilRuler } from 'lucide-react';
import CreateTip from "../../../components/Admin/Tip/CreateTip";
import SearchBox from "../../../components/Search";
import TipDetailPopup from "../../../components/Admin/Tip/TipDetailPopup";
import { toast } from 'react-toastify'; // Import toast

const Tip: React.FC = () => {
  const [tip, setTip] = useState<TipsItem[]>([
    {
      "tip_id": 125,
      "title": "MẸO NẤU MÓN HẦM NHANH",
      "thumbnail": "https://assets.unileversolutions.com/v1/1188474.jpg",
      "content": "<div class=\"cmp-text cmp-text-login-detail\" data-cmp-data-layer='{\"text-1d4709c66d\":{\"@type\":\"unilever/components/text\",\"repo:modifyDate\":\"2023-07-13T08:20:03Z\",\"xdm:text\":\"&lt;p&gt;Món hầm là món ăn giàu dinh dưỡng. Thế nhưng, công việc hầm xương luôn khiến các bà nội trợ cảm thấy nôn nóng tốn khá nhiều thời gian. Knorr sẽ tư vấn vài mẹo giúp bạn hầm xương nhanh nhừ mà vẫn đảm bảo dinh dưỡng cho món ăn.&lt;/p&gt;\\r\\n&lt;h2 class=\\\"sr-only\\\"&gt;nhanh&lt;/h2&gt;\\r\\n&lt;h3&gt;Sơ chế&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;p&gt;Phải làm sạch xương trước khi hầm để nước dùng trong hơn, ít bọt bẩn.&lt;/p&gt;\\r\\n&lt;p&gt;Cách làm sạch đơn giản nhất là rửa xương bằng nước muối loãng. Sau đó chần qua xương với nước sôi.&lt;/p&gt;\\r\\n&lt;h3 style=\\\"text-align: left;\\\"&gt;Để nồi nước hầm xương trong và thơm ngon, bạn có thể cho vào nồi một ít củ hành tím đã nướng chín. Nhớ thường xuyên hớt bọt trong quá trình hầm để nước dùng được trong.&lt;/h3&gt;\\r\\n&lt;h3 style=\\\"text-align: center;\\\"&gt;&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;h3&gt;Chế biến&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;h3&gt;&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;h3&gt;1.Sử dụng nồi áp suất&amp;nbsp;&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;p&gt;Cho xương đã rửa sạch vào nồi áp suất, đậy kín.Tùy theo số lượng xương cần hầm mà điều chỉnh thời gian cho phù hợp, sau đó tắt bếp để nguội. Ưu điểm của cách làm này là tiết kiệm nhiên liệu và thời gian, không làm mất đi chất dinh dưỡng của xương.&lt;/p&gt;\\r\\n&lt;h3&gt;2.Sử dụng nồi thường&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;p&gt;Cho xương vào hầm trong nồi, đợi nước sôi thì hạ lửa, đun liu riu. Lưu ý không đậy kín nắp trong quá trình hầm xương, vì sẽ làm nước dùng bị đục. Lửa hầm xương cũng để nhỏ để lấy hết nước ngọt trong xương tiết ra, giúp nước dùng ngon hơn.&lt;/p&gt;\\r\\n&lt;p&gt;Nên hầm xương tối thiểu trong một tiếng, nhưng tốt nhất là hầm cho đến khi phần thịt bám quanh xương chín mềm, nước dùng sẽ ngọt ngon hơn. Cũng không nên hầm xương quá lâu vì nước dùng sẽ bị đục và có vị chua..&lt;/p&gt;\\r\\n&lt;h3&gt;3.Sử dụng giấm ăn&amp;nbsp;&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;p&gt;Một cách khác giúp xương nhanh mềm, thịt ngon ngọt là cho vào nồi một chút giấm ăn, Tác dụng của giấm là giảm đi sự phân hủy vitamin trong quá trình đun nấu.&lt;/p&gt;\\r\\n&lt;h3&gt;4.Sử dụng các loại thực phẩm dinh dưỡng&amp;nbsp;&amp;nbsp;&lt;/h3&gt;\\r\\n&lt;p&gt;Bạn có thể cho vào nồi một vài miếng thơm, hành tây, gừng, sả, khoai tây, cà rốt…để hầm cùng xương. Những thực phẩm dinh dưỡng này sẽ giúp cho xương nhanh mềm và nước dùng thì ngon ngọt hơn.&lt;/p&gt;\\r\\n\"}}' id=\"text-1d4709c66d\">\n<div class=\"nonLoggedIn\">\n<p>Món hầm là món ăn giàu dinh dưỡng. Thế nhưng, công việc hầm xương luôn khiến các bà nội trợ cảm thấy nôn nóng tốn khá nhiều thời gian. Knorr sẽ tư vấn vài mẹo giúp bạn hầm xương nhanh nhừ mà vẫn đảm bảo dinh dưỡng cho món ăn.</p>\n<h2 class=\"sr-only\">nhanh</h2>\n<h3>Sơ chế </h3>\n<p>Phải làm sạch xương trước khi hầm để nước dùng trong hơn, ít bọt bẩn.</p>\n<p>Cách làm sạch đơn giản nhất là rửa xương bằng nước muối loãng. Sau đó chần qua xương với nước sôi.</p>\n<h3 style=\"text-align: left;\">Để nồi nước hầm xương trong và thơm ngon, bạn có thể cho vào nồi một ít củ hành tím đã nướng chín. Nhớ thường xuyên hớt bọt trong quá trình hầm để nước dùng được trong.</h3>\n<h3 style=\"text-align: center;\"> </h3>\n<h3>Chế biến </h3>\n<h3> </h3>\n<h3>1.Sử dụng nồi áp suất  </h3>\n<p>Cho xương đã rửa sạch vào nồi áp suất, đậy kín.Tùy theo số lượng xương cần hầm mà điều chỉnh thời gian cho phù hợp, sau đó tắt bếp để nguội. Ưu điểm của cách làm này là tiết kiệm nhiên liệu và thời gian, không làm mất đi chất dinh dưỡng của xương.</p>\n<h3>2.Sử dụng nồi thường </h3>\n<p>Cho xương vào hầm trong nồi, đợi nước sôi thì hạ lửa, đun liu riu. Lưu ý không đậy kín nắp trong quá trình hầm xương, vì sẽ làm nước dùng bị đục. Lửa hầm xương cũng để nhỏ để lấy hết nước ngọt trong xương tiết ra, giúp nước dùng ngon hơn.</p>\n<p>Nên hầm xương tối thiểu trong một tiếng, nhưng tốt nhất là hầm cho đến khi phần thịt bám quanh xương chín mềm, nước dùng sẽ ngọt ngon hơn. Cũng không nên hầm xương quá lâu vì nước dùng sẽ bị đục và có vị chua..</p>\n<h3>3.Sử dụng giấm ăn  </h3>\n<p>Một cách khác giúp xương nhanh mềm, thịt ngon ngọt là cho vào nồi một chút giấm ăn, Tác dụng của giấm là giảm đi sự phân hủy vitamin trong quá trình đun nấu.</p>\n<h3>4.Sử dụng các loại thực phẩm dinh dưỡng  </h3>\n<p>Bạn có thể cho vào nồi một vài miếng thơm, hành tây, gừng, sả, khoai tây, cà rốt…để hầm cùng xương. Những thực phẩm dinh dưỡng này sẽ giúp cho xương nhanh mềm và nước dùng thì ngon ngọt hơn.</p>\n</div>\n</div>",
      "createdAt": "2025-04-02T10:46:30.992Z",
      "updatedAt": "2025-04-02T10:46:30.992Z",
      "genres": []
    }
  ]);

  const [searchTitle, setSearchTitle] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<TipsItem | null>(null);
  const [selectedTipIds, setSelectedTipIds] = useState<number[]>([]);
  const [editingTip, setEditingTip] = useState<TipsItem | null>(null);

  const handleAddTip = (newTip: TipsItem) => {
    if (editingTip) {
      setTip(tip.map((t) => (t.tip_id === editingTip.tip_id ? newTip : t)));
      setEditingTip(null);
    } else {
      setTip([...tip, { ...newTip, tip_id: tip.length + 1 }]);
    }
    setIsPopupOpen(false);
  };

  const handleTipClick = (tip: TipsItem) => {
    setSelectedTip(tip);
  };

  const closeTipPopup = () => {
    setSelectedTip(null);
  };

  const toggleSelect = (tipId: number) => {
    setSelectedTipIds((prev) =>
      prev.includes(tipId) ? prev.filter((id) => id !== tipId) : [...prev, tipId]
    );
  };

  const handleDelete = (tipId: number) => {
    setTip(tip.filter((t) => t.tip_id !== tipId));
  };

  const handleBulkDelete = () => {
    setTip(tip.filter((t) => !selectedTipIds.includes(t.tip_id)));
    setSelectedTipIds([]);
  };

  const handleEdit = (tipId: number) => {
    const tipToEdit = tip.find((t) => t.tip_id === tipId);
    if (tipToEdit) {
      setEditingTip(tipToEdit);
      setIsPopupOpen(true);
    }
  };

  const filteredTips = tip.filter((t) =>
    t.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div className="m-12 border border-white rounded-xl shadow-lg bg-white">
      <div className="mb-4 flex items-center justify-between p-4">
        <div className="flex space-x-3">
          <div>
            <button
              onClick={() => {
                setEditingTip(null);
                setIsPopupOpen(true);
              }}
              className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
            >
              <SquarePlus className="text-white" size={18} />
              <span>Tạo mẹo vặt nhà bếp</span>
            </button>

            {isPopupOpen && (
              <CreateTip
                onClose={() => {
                  setIsPopupOpen(false);
                  setEditingTip(null);
                }}
                onSubmit={handleAddTip}
                initialData={editingTip || undefined}
                isEditing={!!editingTip}
              />
            )}
          </div>

          <button
            onClick={handleBulkDelete}
            className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
            disabled={selectedTipIds.length === 0}
          >
            <Trash2 className="text-red-600 hover:text-red-800" size={18} />
            <span>Xóa</span>
          </button>
        </div>

        <SearchBox onSearch={setSearchTitle} isPopupOpen={isPopupOpen} />
      </div>

      <div className="overflow-x-auto ml-4 mr-4 mb-4 rounded-lg ">
        <table className="min-w-full bg-white shadow-md rounded-lg border">
          <thead>
            <tr className="bg-blue-700 text-white text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedTipIds(e.target.checked ? tip.map((t) => t.tip_id) : [])
                  }
                  checked={selectedTipIds.length === tip.length && tip.length > 0}
                />
              </th>
              <th className="p-3">Tiêu đề mẹo vặt</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Cập nhật lần cuối</th>
              <th className="p-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTips.length > 0 ? (
              filteredTips.map((t) => (
                <tr
                  key={t.tip_id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleTipClick(t)}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedTipIds.includes(t.tip_id)}
                      onChange={() => toggleSelect(t.tip_id)}
                    />
                  </td>
                  <td className="p-3">{t.title}</td>
                  <td className="p-3">{new Date(t.createdAt.toString()).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(t.updatedAt.toString()).toLocaleDateString()}</td>

                  <td className="p-3 flex justify-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(t.tip_id);
                      }}
                      className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
                    >
                      <PencilRuler className="text-blue-600 hover:text-blue-800" size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.tip_id);
                      }}
                      className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
                    >
                      <Trash2 className="text-red-600 hover:text-red-800" size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Không tìm thấy kết quả nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedTip && (<TipDetailPopup tip={selectedTip} onClose={closeTipPopup} />)}
    </div>
  );
};

export default Tip;