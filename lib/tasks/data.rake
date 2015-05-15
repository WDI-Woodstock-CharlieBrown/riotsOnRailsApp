
namespace :data do
  desc "Import race riots"
  task :riots => :environment do
    require 'CSV'

    Dir.glob(File.dirname(__FILE__) + "/*.csv").each do |file|
        CSV.foreach(csv_file, {:headers => true, :col_sep => ";"}) do |row|
          riot = Riot.create!(row.to_hash)
          puts row.to_hash
        end

      end

  end
end
